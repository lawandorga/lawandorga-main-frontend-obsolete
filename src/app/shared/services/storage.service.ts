/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as mime from 'mime';


import {
    GetDownloadAllRecordDocumentsApiUrl,
    GetDownloadApiUrl, GetDownloadEncryptedRecordDocumentApiUrl,
    GetSpecialRecordUploadDocumentsApiUrl,
    GetUploadApiUrl,
    UPLOAD_SIGNING_BASE_API_URL
} from '../../statics/api_urls.statics';
import { SnackbarService } from './snackbar.service';
import { Subject } from 'rxjs';
import { AppSandboxService } from '../../core/services/app-sandbox.service';
import { RecordDocument } from '../../recordmanagement/models/record_document.model';
import { FullRecord } from '../../recordmanagement/models/record.model';

@Injectable()
export class StorageService {
    filesToUpload: number;
    filesUploaded: number;
    filesUploadFinished;

    constructor(private http: HttpClient, private snackbarService: SnackbarService, private appSB: AppSandboxService) {}

    private static b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || 'application/zip';
        sliceSize = sliceSize || 512;
        const b64DataString = b64Data.substr(b64Data.indexOf(',') + 1);
        const byteCharacters = atob(b64DataString);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {
            type: contentType,
        });
        return blob;
    }

    public static saveFile(bytes, filename: string) {
        /**
         * base64 bytes of file
         */
        FileSaver.saveAs(StorageService.b64toBlob(bytes, mime.getType(filename), 512), filename);
    }

    uploadFile(file: File, fileDir: string, finished?) {
        // TODO: ! encryption ? used for profile picture? lol
        this.http.get(GetUploadApiUrl(file, fileDir)).subscribe((response: any) => {
            this.uploadFileDirect(file, response.data, response.url, finished);
        });
    }

    uploadFiles(files: File[], file_dir: string, finished?) {
        // TODO: ! encryption deprecated
        this.filesToUpload = files.length;
        this.filesUploaded = 0;
        this.filesUploadFinished = finished ? finished : null;

        const file_names = [];
        const file_types = [];
        for (const file of files) {
            file_names.push(file.name);
            file_types.push(file.type);
        }

        this.http
            .post(UPLOAD_SIGNING_BASE_API_URL, {
                file_names,
                file_types,
                file_dir
            })
            .subscribe((response: any) => {
                const presigned_posts = response.presigned_posts;
                for (const post of presigned_posts) {
                    const file = Array.from(files).filter((filterFile: File) => {
                        return post.data.fields.key === `${file_dir}/${filterFile.name}`;
                    })[0];
                    this.uploadFileDirect(file, post.data, post.url, () => {
                        this.filesUploaded++;
                        if (this.filesUploaded === this.filesToUpload && this.filesUploadFinished)
                            this.filesUploadFinished();
                    });
                }
            });
    }

    uploadEncryptedRecordDocuments(files: File[], record_id) {
        const formData = new FormData();
        for (const file of files){
            formData.append('files', file)
        }
        const privateKeyPlaceholder = this.appSB.getPrivateKeyPlaceholder();
        this.http.post(GetSpecialRecordUploadDocumentsApiUrl(record_id), formData, privateKeyPlaceholder)
            .subscribe(res => {
                console.log(res); // TODO: encryption add to store
            })
    }


    private uploadFileDirect(
        file: File,
        s3Data: { url: string; fields: any },
        url: string,
        callbackFn?
    ) {
        // TODO: ! encryption
        const v4form = new FormData();
        v4form.append('x-amz-credential', s3Data.fields['x-amz-credential']);
        v4form.append('x-amz-algorithm', s3Data.fields['x-amz-algorithm']);
        v4form.append('key', s3Data.fields['key']);
        v4form.append('x-amz-signature', s3Data.fields['x-amz-signature']);
        v4form.append('policy', s3Data.fields['policy']);
        v4form.append('x-amz-date', s3Data.fields['x-amz-date']);
        v4form.append('file', file);

        this.http.post(s3Data.url, v4form).subscribe((response: any) => {
            if (!response) {
                callbackFn();
            }
        });
    }

    downloadEncryptedRecordDocument(document: RecordDocument){
        const privateKeyPlaceholder = this.appSB.getPrivateKeyPlaceholder();
        this.http.get(GetDownloadEncryptedRecordDocumentApiUrl(document.id.toString()), privateKeyPlaceholder).subscribe((response) => {
            StorageService.saveFile(response, document.name)
        })
    }

    downloadAllEncryptedRecordDocuments(record_id: string, record_token: string){
        const privateKeyPlaceholder = this.appSB.getPrivateKeyPlaceholder();
        this.http.get(GetDownloadAllRecordDocumentsApiUrl(record_id), privateKeyPlaceholder).subscribe((response) => {
            console.log('response from download all: ', response);
            StorageService.saveFile(response, `${record_token}_documents.zip`);
        })
    }

    downloadFile(filekey: string) {
        // TODO: ! encryption
        console.log('I WANT TO DOWNLOAD A FILE', filekey);
        this.http.get(GetDownloadApiUrl(filekey)).subscribe((response: any) => {
            if (!response.error) window.location.href = response.data;
            else {
                this.snackbarService.showErrorSnackBar("file not found, can't download");
            }
        });
    }

    downloadAllFilesFromRecord(record: string, record_token: string): void {
        // TODO: ! encryption
        this.http.get(GetDownloadAllRecordDocumentsApiUrl(record)).subscribe((response: any) => {
            StorageService.saveFile(response, `${record_token}_documents.zip`);
        });
    }
}
