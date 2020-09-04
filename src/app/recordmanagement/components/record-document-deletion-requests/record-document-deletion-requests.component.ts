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

import { Component, OnInit } from '@angular/core';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { RecordDocumentDeletionRequest } from '../../models/reocrd_document_deletion_request.model';
import { RestrictedUser } from '../../../core/models/user.model';
import { GetProfileFrontUrl } from '../../../statics/frontend_links.statics';
import { Router } from '@angular/router';

@Component({
    selector: 'app-record-document-deletion-requests',
    templateUrl: './record-document-deletion-requests.component.html',
    styleUrls: ['./record-document-deletion-requests.component.scss']
})
export class RecordDocumentDeletionRequestsComponent implements OnInit {
    deletionRequests: RecordDocumentDeletionRequest[] = [];

    toProcessColumns = [
        'request_from',
        'record',
        'document',
        'requested',
        'state',
        'explanation',
        'accept'
    ];

    alreadyProcessedColumns = [
        'request_from',
        'record',
        'requested',
        'state',
        'processor',
        'processed_on'
    ];

    constructor(private recordSB: RecordsSandboxService, private router: Router) {}

    ngOnInit(): void {
        this.recordSB.getRecordDocumentDeletionRequestsFromServer().then(result => {
            this.deletionRequests = result;
        });
    }

    onUserClick(user: RestrictedUser): void {
        this.router.navigateByUrl(GetProfileFrontUrl(user));
    }

    declineRequest(request: RecordDocumentDeletionRequest): void {
        console.log('recline');
    }

    admitRequest(request: RecordDocumentDeletionRequest): void {
        console.log('admit');
    }

    onRequestClick(request: RecordDocumentDeletionRequest): void {
        console.log('goto record');
    }
}
