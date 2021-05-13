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

import { RestrictedRecord } from '../models/record.model';
import {
  RecordsActions,
  SET_RECORD_DELETION_REQUESTS,
  SET_RECORD_DOCUMENT_TAGS,
  SET_RECORD_PERMISSION_REQUESTS,
  SET_RECORD_STATES,
  SET_RECORD_TAGS,
  SET_RECORDS,
  SET_SPECIAL_CLIENT,
  SET_SPECIAL_ORIGIN_COUNTRY,
  SET_SPECIAL_RECORD,
  SET_SPECIAL_RECORD_DOCUMENTS,
  SET_SPECIAL_RECORD_MESSAGES,
  SET_SPECIAL_RECORD_REQUEST_STATE,
  SET_USERS_POOL_ENLISTINGS,
  UPDATE_RECORD_DELETION_REQUEST,
  UPDATE_RECORD_PERMISSION_REQUEST,
} from './actions/records.actions';
import { OriginCountry } from '../models/country.model';
import { Tag } from '../models/tag.model';
import { FullClient } from '../models/client.model';
import { RecordDocument } from '../models/record_document.model';
import { RecordMessage } from '../models/record_message.model';
import { RecordPermissionRequest } from '../models/record_permission.model';
import { getIdObjects, getObjectsByField } from '../../shared/other/reducer-helper';
import { RestrictedUser } from '../../core/models/user.model';
import { State } from '../../core/models/state.model';
import { RecordDeletionRequest } from '../models/record_deletion_request.model';

export interface RecordsState {
  special_record: {
    record: RestrictedRecord;
    client: FullClient;
    origin_country: OriginCountry;
    record_documents: { [id: number]: RecordDocument };
    record_messages: { [id: number]: RecordMessage };
    request_state: string;
  };
  admin: {
    record_permission_requests: { [id: number]: RecordPermissionRequest };
    record_deletion_requests: { [id: number]: RecordDeletionRequest };
  };
  records: RestrictedRecord[];
  consultants: { [id: number]: RestrictedUser };
  origin_countries: { [id: number]: OriginCountry };
  record_tags: { [id: number]: Tag };
  record_document_tags: { [id: number]: Tag };
  record_states: State[];
  country_states: State[];
  possible_clients: { [id: number]: FullClient };
  pool_records: number;
  pool_consultants: number;
  users_pool_enlistings: number;
}

export const initialState: RecordsState = {
  special_record: {
    record: null,
    client: null,
    origin_country: null,
    record_documents: {},
    record_messages: {},
    request_state: null,
  },
  admin: {
    record_permission_requests: {},
    record_deletion_requests: {},
  },
  records: null,
  consultants: {},
  origin_countries: {},
  record_tags: {},
  record_document_tags: {},
  record_states: [],
  country_states: [],
  possible_clients: {},
  pool_records: 0,
  pool_consultants: 0,
  users_pool_enlistings: 0,
};

export function recordsReducer(state = initialState, action: RecordsActions) {
  switch (action.type) {
    case SET_RECORD_PERMISSION_REQUESTS:
      return {
        ...state,
        admin: {
          ...state.admin,
          record_permission_requests: getIdObjects(action.payload),
        },
      };

    case SET_RECORD_DELETION_REQUESTS:
      return {
        ...state,
        admin: {
          ...state.admin,
          record_deletion_requests: getIdObjects(action.payload),
        },
      };
    case UPDATE_RECORD_DELETION_REQUEST:
      return {
        ...state,
        admin: {
          ...state.admin,
          record_deletion_requests: {
            ...state.admin.record_deletion_requests,
            [action.payload.id]: action.payload,
          },
        },
      };

    default:
      return state;
  }
}
