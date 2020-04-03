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

import { Action } from '@ngrx/store';
import { TableEntry } from '../models/table-entry.model';
import { FolderPermission } from '../models/folder_permission.model';
import { RestrictedGroup } from '../../core/models/group.model';
import { HasPermission } from '../../core/models/permission.model';

export const START_LOADING_FOLDER = 'START_LOADING_FOLDER';
export const SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER';
export const SET_FOLDERS = "SET_FOLDERS";
export const SET_FILES = "SET_FILES";
export const START_DELETING_FILES_AND_FOLDERS = "START_DELETING_FILES_AND_FOLDERS";
export const START_DOWNLOAD_FILES_AND_FOLDERS = "START_DOWNLOAD_FILES_AND_FOLDERS";
export const START_LOADING_FOLDER_PERMISSIONS = "START_LOADING_FOLDER_PERMISSIONS";
export const SET_FOLDER_PERMISSIONS = "SET_FOLDER_PERMISSIONS";
export const RESET_FOLDER_PERMISSIONS = "RESET_FOLDER_PERMISSIONS";
export const START_CREATING_FOLDER_PERMISSION = "START_CREATING_FOLDER_PERMISSION";
export const SET_FOLDER_HAS_PERMISSIONS = "SET_FOLDER_HAS_PERMISSIONS";
export const START_DELETING_FOLDER_PERMISSION = "START_DELETING_FOLDER_PERMISSION";

export class StartLoadingFolder implements Action {
    readonly type = START_LOADING_FOLDER;

    constructor(public payload: string) {
    }
}

export class SetCurrentFolder implements Action {
    readonly type = SET_CURRENT_FOLDER;

    constructor(public payload: TableEntry) {}
}

export class SetFolders implements Action {
    readonly type = SET_FOLDERS;

    constructor(public payload: TableEntry[]) {
    }
}

export class SetFiles implements Action {
    readonly type = SET_FILES;

    constructor(public payload: TableEntry[]) {
    }
}

export class StartDeletingFilesAndFolders implements Action {
    readonly type = START_DELETING_FILES_AND_FOLDERS;

    constructor(public payload: { entries: TableEntry[]; path: string}) {}
}

export class StartDownloadFilesAndFolders implements Action {
    readonly type = START_DOWNLOAD_FILES_AND_FOLDERS;

    constructor(public payload: { entries: TableEntry[], path: string }) {}
}

export class StartLoadingFolderPermissions implements Action {
    readonly type = START_LOADING_FOLDER_PERMISSIONS;

    constructor(public payload: string) {}
}

export class SetFolderPermissions implements Action {
    readonly type = SET_FOLDER_PERMISSIONS;

    constructor(public payload: FolderPermission[]) {}
}

export class ResetFolderPermissions implements Action {
    readonly type = RESET_FOLDER_PERMISSIONS;
}

export class StartCreatingFolderPermission implements Action {
    readonly type = START_CREATING_FOLDER_PERMISSION;

    constructor(public payload: {group: RestrictedGroup, folder: TableEntry, permission: string}){}
}

export class SetFolderHasPermissions implements Action {
    readonly type = SET_FOLDER_HAS_PERMISSIONS;

    constructor(public payload: HasPermission[]) {}
}

export class StartDeletingFolderPermission implements Action {
    readonly type = START_DELETING_FOLDER_PERMISSION;

    constructor(public payload: FolderPermission) {}
}

export type FilesActions = StartLoadingFolder
    | SetCurrentFolder
    | SetFolders
    | SetFiles
    | StartDeletingFilesAndFolders
    | StartDownloadFilesAndFolders
    | StartLoadingFolderPermissions
    | SetFolderPermissions
    | ResetFolderPermissions
    | StartCreatingFolderPermission
    | SetFolderHasPermissions
    | StartDeletingFolderPermission;
