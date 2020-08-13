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
import { AppSandboxService } from '../../core/services/app-sandbox.service';
import { RecordDocument } from '../../recordmanagement/models/record_document.model';

@Injectable()
export class StorageService {
    constructor(private http: HttpClient) {}

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
            type: contentType
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
        for (const file of files) {
            formData.append('files', file);
        }
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        this.http
            .post(GetSpecialRecordUploadDocumentsApiUrl(record_id), formData, privateKeyPlaceholder)
            .subscribe(res => {
                callbackFinishedFn(res);
            });
    }

    downloadEncryptedRecordDocument(document: RecordDocument) {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        this.http
            .get(
                GetDownloadEncryptedRecordDocumentApiUrl(document.id.toString()),
                privateKeyPlaceholder
            )
            .subscribe(response => {
                StorageService.saveFile(response, document.name);
            });
    }

    downloadAllEncryptedRecordDocuments(record_id: string, record_token: string) {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        this.http
            .get(GetDownloadAllRecordDocumentsApiUrl(record_id), privateKeyPlaceholder)
            .subscribe(response => {
                StorageService.saveFile(response, `${record_token}_documents.zip`);
            });
    }

    upload(dataTransferItemList, path, callback) {
        if (Array.isArray(dataTransferItemList)) {
            this.uploadFiles(dataTransferItemList, path, callback);
            return;
        }

        this.getAllFileEntries(dataTransferItemList).then(fileEntries => {
            const formData = new FormData();
            const paths = [];
            let count = 0;
            for (const entry of fileEntries) {
                if (entry.name === '.DS_Store') {
                    // exclude macos specific files
                    count++;
                    continue;
                }
                entry.file(fileResult => {
                    count++;
                    formData.append('files', fileResult);
                    paths.push(entry.fullPath + ';' + fileResult.size);
                    if (count === fileEntries.length) {
                        formData.append('paths', JSON.stringify(paths));
                        formData.append('path', path);

                        this.http
                            .post(
                                FILES_UPLOAD_BASE_API_URL,
                                formData,
                                AppSandboxService.getPrivateKeyPlaceholder()
                            )
                            .subscribe(response => {
                                // TODO?
                                callback(response);
                            });
                    }
                });
            }
        });
    }

    uploadFiles(files, path, callback) {
        let count = 0;
        const formData = new FormData();
        const paths = [];
        for (const entry of files) {
            if (entry.name === '.DS_Store') {
                // exclude macos specific files
                count++;
                continue;
            }
            count++;
            formData.append('files', entry);
            paths.push(entry.name + ';' + entry.size);
            if (count === files.length) {
                formData.append('paths', JSON.stringify(paths));
                formData.append('path', path);
                this.http
                    .post(
                        FILES_UPLOAD_BASE_API_URL,
                        formData,
                        AppSandboxService.getPrivateKeyPlaceholder()
                    )
                    .subscribe(response => {
                        callback(response);
                    });
            }
        }
    }

    async getAllFileEntries(dataTransferItemList: any[]) {
        const fileEntries = [];
        const queue = [];
        for (let i = 0; i < dataTransferItemList.length; i++) {
            queue.push(dataTransferItemList[i].webkitGetAsEntry());
        }
        while (queue.length > 0) {
            const entry = queue.shift();
            if (entry.isFile) {
                fileEntries.push(entry);
            } else if (entry.isDirectory) {
                queue.push(...(await this.readAllDirectoryEntries(entry.createReader())));
            }
        }
        return fileEntries;
    }

    async readAllDirectoryEntries(directoryReader) {
        const entries = [];
        let readEntries = await this.readEntriesPromise(directoryReader);
        while (readEntries.length > 0) {
            entries.push(...readEntries);
            readEntries = await this.readEntriesPromise(directoryReader);
        }
        return entries;
    }

    async readEntriesPromise(directoryReader): Promise<any> {
        try {
            return await new Promise((resolve, reject) => {
                directoryReader.readEntries(resolve, reject);
            });
        } catch (err) {
            console.log(err);
        }
    }
}
