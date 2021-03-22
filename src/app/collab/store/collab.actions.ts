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

export const SET_ALL_DOCUMENTS = 'SET_ALL_DOCUMENTS';
export const START_LOADING_ALL_DOCUMENTS = 'START_LOADING_ALL_DOCUMENTS';
export const START_ADDING_DOCUMENT = 'START_ADDING_DOCUMENT';
export const START_DELETING_COLLAB_DOCUMENT = 'START_DELETING_COLLAB_DOCUMENT';

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

export type CollabActions =
    | SetAllDocuments
    | StartLoadingAllDocuments
    | StartAddingDocument
    | StartDeletingCollabDocument;
