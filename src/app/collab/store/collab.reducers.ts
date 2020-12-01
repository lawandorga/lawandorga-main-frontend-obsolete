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
import { CollabActions, SET_ALL_DOCUMENTS } from './collab.actions';

export interface CollabState {
    all_documents: NameCollabDocument[];
}

export const initialState: CollabState = {
    all_documents: []
};

export function collabReducer(state = initialState, action: CollabActions) {
    switch (action.type) {
        case SET_ALL_DOCUMENTS:
            return {
                ...state,
                all_documents: action.payload
            };
        default:
            return state;
    }
}
