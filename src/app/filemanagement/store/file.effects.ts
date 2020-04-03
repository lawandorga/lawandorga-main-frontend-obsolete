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
    SET_CURRENT_FOLDER,
    SET_FILES,
    SET_FOLDER_HAS_PERMISSIONS,
    SET_FOLDER_PERMISSIONS,
    SET_FOLDERS,
    START_CREATING_FOLDER_PERMISSION,
    START_DELETING_FILES_AND_FOLDERS,
    START_DELETING_FOLDER_PERMISSION,
    START_DOWNLOAD_FILES_AND_FOLDERS,
    START_LOADING_FOLDER,
    START_LOADING_FOLDER_PERMISSIONS,
    StartCreatingFolderPermission,
    StartDeletingFilesAndFolders,
    StartDeletingFolderPermission,
    StartDownloadFilesAndFolders,
    StartLoadingFolder,
    StartLoadingFolderPermissions
} from './files.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
    FILES_DELETE_BASE_API_URL,
    FILES_DOWNLOAD_BASE_API_URL,
    FILES_PERMISSION_FOR_FOLDER_BASE_API_URL,
    GetFolderInformationApiUrl,
    GetFolderPermissionApiUrl,
    GetFolderPermissionsForFolderApiUrl
} from '../../statics/api_urls.statics';
import { TableEntry } from '../models/table-entry.model';
import { CoreSandboxService } from '../../core/services/core-sandbox.service';
import { StorageService } from '../../shared/services/storage.service';
import { FolderPermission, FolderPermissionFrom } from '../models/folder_permission.model';
import { RestrictedGroup } from '../../core/models/group.model';
import { HasPermission } from '../../core/models/permission.model';

@Injectable()
export class FilesEffects {
    constructor(
        private actions: Actions,
        private http: HttpClient,
        private fileSB: FilesSandboxService,
        private coreSB: CoreSandboxService
    ) {}

    @Effect()
    startLoadingFolder = this.actions.pipe(
        ofType(START_LOADING_FOLDER),
        map((action: StartLoadingFolder) => {
            return action.payload;
        }),
        mergeMap((path: string) => {
            return from(
                this.http.get(GetFolderInformationApiUrl(path)).pipe(
                    catchError(error => {
                        console.log('error: ', error);
                        return [];
                    }),
                    mergeMap((response: any) => {
                        const folders = TableEntry.getFolderTableEntriesFromJsonArray(
                            response.folders
                        );
                        const files = TableEntry.getFileTableEntriesFromJsonArray(response.files);
                        const current_folder = TableEntry.getFolderTableEntryFromJson(
                            response.current_folder
                        );
                        return [
                            { type: SET_FOLDERS, payload: folders },
                            { type: SET_FILES, payload: files },
                            { type: SET_CURRENT_FOLDER, payload: current_folder }
                        ];
                    })
                )
            );
        })
    );

    @Effect()
    startDeletingFilesAndFolders = this.actions.pipe(
        ofType(START_DELETING_FILES_AND_FOLDERS),
        map((action: StartDeletingFilesAndFolders) => {
            return action.payload;
        }),
        mergeMap((payload: { entries: TableEntry[]; path: string }) => {
            return from(
                this.http
                    .post(FILES_DELETE_BASE_API_URL, {
                        entries: payload.entries,
                        path: payload.path
                    })
                    .pipe(
                        catchError(error => {
                            console.log('error: ', error);
                            return [];
                        }),
                        mergeMap((response: any) => {
                            this.coreSB.showSuccessSnackBar(
                                'successfully deleted files and folders'
                            );
                            // console.log('response from deletion', response);
                            return [
                                {
                                    type: START_LOADING_FOLDER,
                                    payload: payload.path
                                }
                            ];
                        })
                    )
            );
        })
    );

    @Effect()
    startDownloadFilesAndFolders = this.actions.pipe(
        ofType(START_DOWNLOAD_FILES_AND_FOLDERS),
        map((action: StartDownloadFilesAndFolders) => {
            return action.payload;
        }),
        mergeMap((payload: { entries: TableEntry[]; path: string }) => {
            return from(
                this.http
                    .post(FILES_DOWNLOAD_BASE_API_URL, {
                        entries: payload.entries,
                        path: payload.path
                    })
                    .pipe(
                        catchError(error => {
                            console.log('error: ', error);
                            return [];
                        }),
                        mergeMap((response: any) => {
                            // console.log('response from deletion', response);
                            if (payload.entries.length === 1) {
                                payload.path = payload.entries[0].name;
                            } else if (payload.path === '') {
                                payload.path = 'root';
                            }
                            StorageService.saveFile(response, payload.path + '.zip');
                            return [];
                        })
                    )
            );
        })
    );

    @Effect()
    startLoadingFolderPermissions = this.actions.pipe(
        ofType(START_LOADING_FOLDER_PERMISSIONS),
        map((action: StartLoadingFolderPermissions) => {
            return action.payload;
        }),
        mergeMap((payload: string) => {
            return from(
                this.http.get(GetFolderPermissionsForFolderApiUrl(payload)).pipe(
                    catchError(error => {
                        console.log('error: ', error);
                        return [];
                    }),
                    mergeMap((response: any) => {
                        let folder_permissions = FolderPermission.getFolderPermissionsFromJsonArray(
                            response.folder_permissions,
                            FolderPermissionFrom.Parent
                        );
                        folder_permissions = folder_permissions.concat(
                            FolderPermission.getFolderPermissionsFromJsonArray(
                                response.folder_visible,
                                FolderPermissionFrom.Children
                            )
                        );
                        const has_permissions = HasPermission.getPermissionsFromJsonArray(
                            response.general_permissions
                        );
                        return [
                            {
                                type: SET_FOLDER_PERMISSIONS,
                                payload: folder_permissions
                            },
                            {
                                type: SET_FOLDER_HAS_PERMISSIONS,
                                payload: has_permissions
                            }
                        ];
                    })
                )
            );
        })
    );

    @Effect()
    startCreatingFolderPermission = this.actions.pipe(
        ofType(START_CREATING_FOLDER_PERMISSION),
        map((action: StartCreatingFolderPermission) => {
            return action.payload;
        }),
        mergeMap((payload: { folder: TableEntry; group: RestrictedGroup; permission: string }) => {
            return from(
                this.http
                    .post(FILES_PERMISSION_FOR_FOLDER_BASE_API_URL, {
                        group: payload.group.id,
                        folder: payload.folder.id,
                        permission: payload.permission
                    })
                    .pipe(
                        catchError(error => {
                            console.log('error: ', error);
                            return [];
                        }),
                        mergeMap((response: any) => {
                            console.log('response: ', response);
                            return [
                                {
                                    type: START_LOADING_FOLDER_PERMISSIONS,
                                    payload: payload.folder.id
                                }
                            ];
                        })
                    )
            );
        })
    );

    @Effect()
    startDeletingFolderPermission = this.actions.pipe(
        ofType(START_DELETING_FOLDER_PERMISSION),
        map((action: StartDeletingFolderPermission) => {
            return action.payload;
        }),
        mergeMap((payload: FolderPermission) => {
            return from(
                this.http.delete(GetFolderPermissionApiUrl(payload.id)).pipe(
                    catchError(error => {
                        console.log('error: ', error);
                        return [];
                    }),
                    mergeMap((response: any) => {
                        console.log('response: ', response);
                        return [
                            {
                                type: START_LOADING_FOLDER_PERMISSIONS,
                                payload: payload.folderId
                            }
                        ];
                    })
                )
            );
        })
    );
}
