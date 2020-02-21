/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
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
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { FilesSandboxService } from '../services/files-sandbox.service';
import {
    SET_FILES,
    SET_FOLDERS,
    START_DELETING_FILES_AND_FOLDERS, START_DOWNLOAD_FILES_AND_FOLDERS,
    START_LOADING_FOLDER,
    StartDeletingFilesAndFolders, StartDownloadFilesAndFolders,
    StartLoadingFolder
} from './files.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
    FILES_DELETE_BASE_API_URL,
    FILES_DOWNLOAD_BASE_API_URL,
    GetFolderInformationApiUrl
} from '../../statics/api_urls.statics';
import { FilesTypes, TableEntry } from '../models/table-entry.model';
import { CoreSandboxService } from '../../core/services/core-sandbox.service';
import { StorageService } from '../../shared/services/storage.service';

@Injectable()
export class FilesEffects{
    constructor(
        private actions: Actions,
        private http: HttpClient,
        private fileSB: FilesSandboxService,
        private coreSB: CoreSandboxService,
        private storageService: StorageService
    ) {}

    @Effect()
    startLoadingFolder = this.actions.pipe(
        ofType(START_LOADING_FOLDER),
        map((action: StartLoadingFolder) => {
            return action.payload;
        }),
        mergeMap((path: string) => {
            console.log('effect fired');
            return from(
                this.http.get(GetFolderInformationApiUrl(path)).pipe(
                    catchError(error => {
                        console.log('error: ', error);
                        return []
                    }),
                    mergeMap((response: any) => {
                        console.log('response from loading folder', response);
                        console.log('i send these folders', response.folders);
                        const folders = TableEntry.getFolderTableEntriesFromJsonArray(response.folders);
                        const files = TableEntry.getFileTableEntriesFromJsonArray(response.files);

                        return [{type: SET_FOLDERS, payload: folders}, {type: SET_FILES, payload: files}];
                    })
                )
            );
        })
    )


    @Effect()
    startDeletingFilesAndFolders = this.actions.pipe(
        ofType(START_DELETING_FILES_AND_FOLDERS),
        map((action: StartDeletingFilesAndFolders) => {
            return action.payload;
        }),
        mergeMap((payload: { entries: TableEntry[]; path: string }) => {
            // payload.entries.map((entry: TableEntry) => {
            //     if (entry.type === FilesTypes.Folder){
            //         entry.type = 'Folder';
            //     }
            // });
            return from(
                this.http.post(FILES_DELETE_BASE_API_URL, {
                    'entries': payload.entries,
                    'path': payload.path
                }).pipe( catchError(error => {
                        console.log('error: ', error);
                        return [];
                    }),
                    mergeMap((response: any) => {
                        this.coreSB.showSuccessSnackBar('successfully deleted files and folders')
                        console.log('response from deletion', response);
                        return [];
                    }))
            );
        })
    )

    @Effect()
    startDownloadFilesAndFolders = this.actions.pipe(
        ofType(START_DOWNLOAD_FILES_AND_FOLDERS),
        map((action: StartDownloadFilesAndFolders) => {
            return action.payload;
        }),
        mergeMap((payload: { entries: TableEntry[], path: string}) => {
            return from(
                this.http.post(FILES_DOWNLOAD_BASE_API_URL, {
                    'entries': payload.entries,
                    'path': payload.path
                }).pipe( catchError(error => {
                        console.log('error: ', error);
                        return [];
                    }),
                    mergeMap((response: any) => {
                        console.log('response from deletion', response);
                        if (payload.path === ''){
                            payload.path = 'root'
                        }
                        StorageService.saveFile(response, payload.path + '.zip');
                        return [];
                    }))
            );
        })
    )
}
