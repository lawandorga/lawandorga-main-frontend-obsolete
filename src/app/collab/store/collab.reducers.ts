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

import { NameCollabDocument } from '../models/collab-document.model';
import {
    CollabActions,
    SET_ALL_DOCUMENTS,
    SET_COLLAB_PERMISSIONS,
    SET_DOCUMENT_PERMISSIONS
} from './collab.actions';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { tree } from 'lib0';
import { HasPermission, Permission } from '../../core/models/permission.model';
import { CollabPermission } from '../models/collab_permission.model';

export interface CollabState {
    all_documents: { [id: number]: NameCollabDocument };
    all_documents_tree: { [id: number]: NameCollabDocument };
    collab_permissions: { [id: number]: Permission };
    document_permissions: {
        collab_permissions: CollabPermission[];
        general_permissions: HasPermission[];
    };
}

export const initialState: CollabState = {
    all_documents: [],
    all_documents_tree: [],
    collab_permissions: {},
    document_permissions: {
        collab_permissions: [],
        general_permissions: []
    }
};

export function collabReducer(state = initialState, action: CollabActions) {
    switch (action.type) {
        case SET_ALL_DOCUMENTS:
            const all_docs = getAllDocsFromTree(action.payload);
            return {
                ...state,
                all_documents_tree: getIdObjects(action.payload),
                all_documents: getIdObjects(all_docs)
            };
        case SET_COLLAB_PERMISSIONS:
            return {
                ...state,
                collab_permissions: getIdObjects(action.payload)
            };
        case SET_DOCUMENT_PERMISSIONS:
            return {
                ...state,
                document_permissions: {
                    collab_permissions: action.payload.collab_permissions,
                    general_permissions: action.payload.general_permissions
                }
            };
        default:
            return state;
    }
}

const getAllDocsFromTree = (tree_docs: NameCollabDocument[]): NameCollabDocument[] => {
    const all_docs: NameCollabDocument[] = [];
    for (const doc of tree_docs) {
        all_docs.push(doc);
        all_docs.push(...getAllDocsFromTree(doc.children));
    }
    return all_docs;
};
