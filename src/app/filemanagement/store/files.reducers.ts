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


import {
    ADD_FOLDER,
    FilesActions,
    RESET_FOLDER_PERMISSIONS,
    SET_CURRENT_FOLDER,
    SET_FILES,
    SET_FOLDER_HAS_PERMISSIONS,
    SET_FOLDER_PERMISSIONS,
    SET_FOLDERS,
    SET_WRITE_PERMISSION
} from './files.actions';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { TableEntry } from '../models/table-entry.model';
import { FolderPermission } from '../models/folder_permission.model';
import { HasPermission } from '../../core/models/permission.model';

export interface FilesState {
    current_folder: TableEntry,
    write_permission: boolean,
    folders: { [id: number]: TableEntry },
    files: { [id: number]: TableEntry },
    folder_permissions: { [id: number]: FolderPermission},
    folder_has_permissions: { [id: number]: HasPermission}
}

export const initialState: FilesState = {
    current_folder: null,
    write_permission: false,
    folders: {},
    files: {},
    folder_permissions: {},
    folder_has_permissions: {}
};

export function filesReducer(state = initialState, action: FilesActions) {
    switch (action.type) {
        case SET_FOLDERS:
            return {
                ...state,
                folders: getIdObjects(action.payload)
            };
        case SET_FILES:
            return {
                ...state,
                files: getIdObjects(action.payload)
            };
        case SET_CURRENT_FOLDER:
            return {
                ...state,
                current_folder: action.payload
            };
        case SET_FOLDER_PERMISSIONS:
            return {
                ...state,
                folder_permissions: getIdObjects(action.payload)
            };
        case RESET_FOLDER_PERMISSIONS:
            return {
                ...state,
                folder_permissions: {}
            };
        case SET_FOLDER_HAS_PERMISSIONS:
            return {
                ...state,
                folder_has_permissions: getIdObjects(action.payload)
            };
        case ADD_FOLDER:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    [action.payload.id]: action.payload
                }
            };
        case SET_WRITE_PERMISSION:
            return {
                ...state,
                write_permission: action.payload
            }
        default:
            return state;
    }
}
