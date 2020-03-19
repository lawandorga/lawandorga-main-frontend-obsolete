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


import { FilesActions, SET_CURRENT_FOLDER, SET_FILES, SET_FOLDERS } from './files.actions';
import { FullFolder } from '../models/folder.model';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { TableEntry } from '../models/table-entry.model';

export interface FilesState {
    current_folder: TableEntry,
    folders: { [id: number]: TableEntry },
    files: { [id: number]: TableEntry }
}

export const initialState: FilesState = {
    current_folder: null,
    folders: {},
    files: {}
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
        default:
            return state;
    }
}
