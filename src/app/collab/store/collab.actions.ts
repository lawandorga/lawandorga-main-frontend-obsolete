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

import { Action } from '@ngrx/store';
import { NameCollabDocument } from '../models/collab-document.model';
import { HasPermission, Permission } from '../../core/models/permission.model';
import { CollabPermission } from '../models/collab_permission.model';

export const SET_ALL_DOCUMENTS = 'SET_ALL_DOCUMENTS';
export const START_LOADING_ALL_DOCUMENTS = 'START_LOADING_ALL_DOCUMENTS';
export const START_ADDING_DOCUMENT = 'START_ADDING_DOCUMENT';
export const START_DELETING_COLLAB_DOCUMENT = 'START_DELETING_COLLAB_DOCUMENT';
export const START_LOADING_COLLAB_DOCUMENT_PERMISSIONS =
    'START_LOADING_COLLAB_DOCUMENT_PERMISSIONS';
export const START_ADDING_COLLAB_DOCUMENT_PERMISSION = 'START_ADDING_COLLAB_DOCUMENT_PERMISSION';
export const START_LOADING_COLLAB_PERMISSIONS = 'START_LOADING_COLLAB_PERMISSIONS';
export const SET_COLLAB_PERMISSIONS = 'SET_COLLAB_PERMISSIONS';
export const SET_DOCUMENT_PERMISSIONS = 'SET_DOCUMENT_PERMISSIONS';
export const START_DELETING_COLLAB_DOCUMENT_PERMISSION =
    'START_DELETING_COLLAB_DOCUMENT_PERMISSION';

export class SetAllDocuments implements Action {
    readonly type = SET_ALL_DOCUMENTS;

    constructor(public payload: NameCollabDocument[]) {}
}

export class StartLoadingAllDocuments implements Action {
    readonly type = START_LOADING_ALL_DOCUMENTS;
}

export class StartAddingDocument implements Action {
    readonly type = START_ADDING_DOCUMENT;

    constructor(public payload: { path: string }) {}
}

export class StartDeletingCollabDocument implements Action {
    readonly type = START_DELETING_COLLAB_DOCUMENT;

    constructor(public payload: { id: number }) {}
}

export class StartLoadingCollabDocumentPermissions implements Action {
    readonly type = START_LOADING_COLLAB_DOCUMENT_PERMISSIONS;

    constructor(public payload: { id: number }) {}
}

export class StartLoadingCollabPermissions implements Action {
    readonly type = START_LOADING_COLLAB_PERMISSIONS;
}

export class StartAddingCollabDocumentPermission implements Action {
    readonly type = START_ADDING_COLLAB_DOCUMENT_PERMISSION;

    constructor(public payload: { document_id: number; group_id: string; permission_id: string }) {}
}

export class SetCollabPermissions implements Action {
    readonly type = SET_COLLAB_PERMISSIONS;

    constructor(public payload: Permission[]) {}
}

export class SetDocumentPermissions implements Action {
    readonly type = SET_DOCUMENT_PERMISSIONS;

    constructor(
        public payload: {
            general_permissions: HasPermission[];
            collab_permissions: CollabPermission[];
        }
    ) {}
}

export class StartDeletingCollabDocumentPermission implements Action {
    readonly type = START_DELETING_COLLAB_DOCUMENT_PERMISSION;

    constructor(public payload: { collab_document_permission_id: number }) {}
}

export type CollabActions =
    | SetAllDocuments
    | StartLoadingAllDocuments
    | StartAddingDocument
    | StartDeletingCollabDocument
    | StartLoadingCollabDocumentPermissions
    | StartAddingCollabDocumentPermission
    | StartLoadingCollabPermissions
    | SetCollabPermissions
    | SetDocumentPermissions
    | StartDeletingCollabDocumentPermission;
