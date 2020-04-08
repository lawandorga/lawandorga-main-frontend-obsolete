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
    constructor(private http: HttpClient) {
    }

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

    upload(path: string, stuff: any, callbackFn) {
        // this.getFilesAndPathsFromDrop(stuff, (formData, paths) => {
        //     formData.append('paths', JSON.stringify(paths));
        //     formData.append('path', path);
        //     this.http
        //         .post(
        //             FILES_UPLOAD_BASE_API_URL,
        //             formData,
        //             AppSandboxService.getPrivateKeyPlaceholder()
        //         )
        //         .subscribe(response => {
        //             // TODO?
        //             callbackFn(response);
        //         });
        // });

        // 2nd
        this.callGetFilesAndPathFromDropRecursive(stuff, (formData, paths) => {
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
                    callbackFn(response);
                });
        });

        //3rd
        // this.testRecursive(stuff, (formData, paths) => {
        //     console.log('after all: ', formData, paths);
        //     formData.append('paths', JSON.stringify(paths));
        //     formData.append('path', path);
        //     this.http
        //         .post(
        //             FILES_UPLOAD_BASE_API_URL,
        //             formData,
        //             AppSandboxService.getPrivateKeyPlaceholder()
        //         )
        //         .subscribe(response => {
        //             // TODO?
        //             callbackFn(response);
        //         });
        // });
    }

    getFilesAndPathsFromDrop(dropped: any, callback: Function) {
        console.log('getFilesAndPathsFromDrop here!!!!');
        const formData = new FormData();
        let maxItems = dropped.length;
        let currentItems = 0;
        const paths = [];
        console.log('dropped: ', dropped);
        for (let i = 0; i < dropped.length; ++i) {
            if (!Array.isArray(dropped[i])) {
                console.log('a file', dropped[i]);
                formData.append('files', dropped[i]);
                paths.push(dropped[i].name + ';' + dropped[i].size);
                currentItems++;
                if (currentItems === maxItems) {
                    formData.append('paths', JSON.stringify(paths));
                    console.log('i will send this formData', formData);
                    callback(formData, paths);
                }
            } else {
                console.log('a folder', dropped[i]);
                maxItems += dropped[i].length - 1;
                for (const fileInFolder of dropped[i]) {
                    console.log('current fileinfolder', fileInFolder);
                    fileInFolder.file(file => {
                        paths.push(fileInFolder.fullPath + ';' + file.size);
                        console.log('conversion successfull', file);
                        formData.append('files', file);
                        currentItems++;
                        if (currentItems === maxItems) {
                            formData.append('paths', JSON.stringify(paths));
                            console.log('i will send this formData', formData);
                            callback(formData, paths);
                        }
                    });
                }
            }
        }
    }

    testRecursive(dropped: any, callback) {
        const formData = new FormData();
        const paths = [];
        if (Array.isArray(dropped)) {
            console.log('im i an array, ', dropped);
            let items = 0;
            for (const item of dropped) {
                this.testRecursive(item, (localFormData, localPaths) => {
                    items++;
                    console.log('paths before', paths);
                    // this.testCallback(formData, paths, localFormData, localPaths);
                    formData.append('files', localFormData.get('files'));
                    paths.push(...localPaths);

                    console.log('paths after: ', paths);
                    if (items === dropped.length) {
                        console.log('i got all my dropped files');
                        callback(formData, paths);
                    }
                });
            }
        } else if (dropped.isFile) {
            dropped.file(file => {
                console.log('its a file ', file);
                formData.append('files', file);
                paths.push(file.name + ';' + file.size);
                callback(formData, paths);
            });
        } else if (dropped.isDirectory) {
            const reader = dropped.createReader();
            reader.readEntries((entries) => {
                let entryCounter = 0;
                for (const entry of entries) {
                    this.testRecursive(entry, (localFormData, localPaths) => {
                        entryCounter++;
                        console.log('paths before', paths);

                        // this.testCallback(formData, paths, localFormData, localPaths);
                        formData.append('files', localFormData.get('files'));
                        paths.push(...localPaths);

                        console.log('paths after', paths);
                        if (entryCounter === entries.length) {
                            console.log('i got all my dropped files');
                            callback(formData, paths);
                        }
                    });
                }
            });
        }
    }

    getFilesAndPathFromDropRecursive(dropped: any, callback): any {
        let currentItems = 0;
        const paths = [];
        const formData = new FormData();
        const maxItems = dropped.length;
        console.log('im dropped, ', dropped);
        if (!Array.isArray(dropped) && dropped.isFile) {
            console.log('a file', dropped);
            formData.append('files', dropped);
            paths.push(dropped.name + ';' + dropped.size);

            formData.append('paths', JSON.stringify(paths));
            console.log('i am a file and will send this path', dropped.name);
            callback(formData, paths);
        } else {
            // its a folder -> recursive
            console.log('a folder: ', dropped);
            for (const fileInFolder of dropped) {
                console.log('in folder, current item: ', fileInFolder);
                if (fileInFolder.isDirectory) {
                    const reader = fileInFolder.createReader();
                    reader.readEntries((entries) => {
                        console.log('i came from ', fileInFolder);
                        console.log('i got these sub-entries', entries);
                        for (const entry of entries) {
                            formData.append('files', entry);
                            paths.push(entry.name + ';' + entry.size);
                        }
                        callback(formData, paths);
                    });
                }

                this.getFilesAndPathFromDropRecursive(fileInFolder, (localFormData, localPaths) => {
                    currentItems++;
                    console.log('i got one folder back and i append', localPaths);
                    formData.append('files', localFormData.get('files'));
                    formData.append('paths', localFormData.get('paths'));
                    paths.push(...localPaths);

                    if (currentItems === dropped.length) {
                        callback(formData, paths);
                        console.log('i got all local folders back');
                    }
                });

                // console.log('current fileinfolder', fileInFolder);
                // fileInFolder.file(file => {
                //     paths.push(fileInFolder.fullPath + ';' + file.size);
                //     console.log('conversion successfull', file);
                //     formData.append('files', file);
                //     currentItems++;
                //     if (currentItems === maxItems) {
                //         formData.append('paths', JSON.stringify(paths));
                //         callback(formData, paths);
                //     }
                // });
            }
        }
    }

    callGetFilesAndPathFromDropRecursive(dropped: any, callback: Function): any {
        console.log('dropped: ', dropped);
        const formData = new FormData();
        const paths = [];
        let counter = 0;
        for (let i = 0; i < dropped.length; ++i) {
            this.getFilesAndPathFromDropRecursive(dropped[i], (localFormData, localPaths) => {
                counter++;
                // console.log('counter increased');
                // console.log('i got formData', localFormData);
                // console.log('i got paths', localPaths);
                paths.push(...localPaths);
                formData.append('files', localFormData.get('files'));
                formData.append('paths', localFormData.get('paths'));
                if (counter === dropped.length) {
                    console.log('all files and folders loaded');
                    console.log('formData', formData);
                    console.log('paths', paths);
                    callback(formData, paths);
                }
            });
        }
    }

    uploadNew(dataTransferItemList, path, callback){
        this.getAllFileEntries(dataTransferItemList).then((fileEntries) => {
            console.log('fileEntries: ', fileEntries);
            const formData = new FormData();
            const paths = [];
            let count = 0;
            for (const entry of fileEntries){
                if (entry.name === '.DS_Store'){
                    count++;
                    continue;
                }
                console.log('entry of fileEntries', entry);
                entry.file((fileResult) => {
                    console.log('fileResult of entry, ', fileResult);
                    count++;
                    formData.append('files', fileResult);
                    paths.push(entry.fullPath + ';' + fileResult.size);
                    if (count === fileEntries.length){
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
                })

            }


            // callback(formData, paths);

        });
    }

    async getAllFileEntries(dataTransferItemList) {
        const fileEntries = [];
        // Use BFS to traverse entire directory/file structure
        const queue = [];
        // Unfortunately dataTransferItemList is not iterable i.e. no forEach
        for (let i = 0; i < dataTransferItemList.length; i++) {
            queue.push(dataTransferItemList[i].webkitGetAsEntry());
        }
        while (queue.length > 0) {
            const entry = queue.shift();
            if (entry.isFile) {
                fileEntries.push(entry);
            } else if (entry.isDirectory) {
                queue.push(...await this.readAllDirectoryEntries(entry.createReader()));
            }
        }
        return fileEntries;
    }


    // Get all the entries (files or sub-directories) in a directory
    // by calling readEntries until it returns empty array
    async readAllDirectoryEntries(directoryReader) {
        const entries = [];
        let readEntries = await this.readEntriesPromise(directoryReader);
        while (readEntries.length > 0) {
            entries.push(...readEntries);
            readEntries = await this.readEntriesPromise(directoryReader);
        }
        return entries;
    }

    // Wrap readEntries in a promise to make working with readEntries easier
    // readEntries will return only some of the entries in a directory
    // e.g. Chrome returns at most 100 entries at a time
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
