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
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as mime from 'mime';


import {
    FILES_UPLOAD_BASE_API_URL,
    GetDownloadAllRecordDocumentsApiUrl,
    GetDownloadEncryptedRecordDocumentApiUrl,
    GetSpecialRecordUploadDocumentsApiUrl
} from '../../statics/api_urls.statics';
import { SnackbarService } from './snackbar.service';
import { AppSandboxService } from '../../core/services/app-sandbox.service';
import { RecordDocument } from '../../recordmanagement/models/record_document.model';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { FilesSandboxService } from '../../filemanagement/services/files-sandbox.service';

@Injectable()
export class StorageService {

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

    uploadEncryptedRecordDocuments(files: File[], record_id, callbackFinishedFn?: Function) {
        const formData = new FormData();
        for (const file of files){
            formData.append('files', file)
        }
        const privateKeyPlaceholder = this.appSB.getPrivateKeyPlaceholder();
        this.http.post(GetSpecialRecordUploadDocumentsApiUrl(record_id), formData, privateKeyPlaceholder)
            .subscribe(res => {
                callbackFinishedFn(res);
            })
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
            StorageService.saveFile(response, `${record_token}_documents.zip`);
        })
    }

    upload(path: string, stuff: any, callbackFn){
        this.getFilesAndPathsFromDrop(stuff, (formData, paths) => {
            formData.append('paths', JSON.stringify(paths));
            formData.append('path', path)
            this.http.post(FILES_UPLOAD_BASE_API_URL, formData).subscribe(response => {
                // TODO?
                callbackFn(response);
            })
        });

    }

    getFilesAndPathsFromDrop(dropped: any, callback: Function){
        const formData = new FormData();
        let maxItems = dropped.length;
        let currentItems = 0;
        const paths = [];
        for (let i = 0; i < dropped.length; ++i){
            if (!Array.isArray(dropped[i]) ){
                // console.log('a file', dropped[i]);
                formData.append('files', dropped[i]);
                paths.push(dropped[i].name + ';' + dropped[i].size);
                currentItems++;
                if (currentItems === maxItems){
                    // formData.append('paths', JSON.stringify(paths));
                    callback(formData, paths);
                }
            } else {
                // console.log('a folder', dropped[i]);
                maxItems += dropped[i].length - 1;
                for (const fileInFolder of dropped[i]){
                    // console.log('current filinfolder', fileInFolder);
                    fileInFolder.file((file => {
                        paths.push(fileInFolder.fullPath + ';' + file.size)
                        // console.log('conversion successfull', file);
                        formData.append('files', file);
                        currentItems++;
                        if (currentItems === maxItems){
                            // formData.append('paths', JSON.stringify(paths));
                            callback(formData, paths);
                        }
                    }));
                }
            }
        }
    }

}
