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

import { RestrictedUser } from '../../core/models/user.model';
import { TokenRecord } from './record.model';
import { NameRecordDocument } from './record_document.model';
import { BaseRequest } from '../../core/models/base_request.model';

export class RecordDocumentDeletionRequest extends BaseRequest {
    constructor(
        public id: string,
        public request_from: RestrictedUser,
        public request_processed: RestrictedUser,
        public requested: Date,
        public processed_on: Date,
        state: string,
        public explanation: string,
        public document?: NameRecordDocument,
        public record?: TokenRecord
    ) {
        super();
        this.id = id;
        this.request_from = request_from;
        this.request_processed = request_processed;
        this.requested = requested;
        this.processed_on = processed_on;
        this.explanation = explanation;
        this.document = document;
        this.record = record;
        this.state = BaseRequest.getState(state);
    }

    static getRecordDocumentDeletionRequestsFromJsonArray(
        jsonArray
    ): RecordDocumentDeletionRequest[] {
        const recordPermissions: RecordDocumentDeletionRequest[] = [];
        Object.values(jsonArray).map(jsonRecordPermission => {
            recordPermissions.push(
                RecordDocumentDeletionRequest.getRecordDeletionRequestFromJson(jsonRecordPermission)
            );
        });
        return recordPermissions;
    }

    static getRecordDeletionRequestFromJson(json): RecordDocumentDeletionRequest {
        return new RecordDocumentDeletionRequest(
            json.id,
            RestrictedUser.getRestrictedUserFromJson(json.request_from),
            RestrictedUser.getRestrictedUserFromJson(json.request_processed),
            new Date(json.requested),
            new Date(json.processed_on),
            json.state,
            json.explanation,
            NameRecordDocument.getNameRecordDocumentFromJson(json.document),
            TokenRecord.getTokenRecordFromJson(json.document ? json.document.record : null)
        );
    }
}
