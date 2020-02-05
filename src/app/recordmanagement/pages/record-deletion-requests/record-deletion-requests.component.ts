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
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';
import { RestrictedUser } from '../../../core/models/user.model';
import { GetProfileFrontUrl, GetRecordFrontUrl } from '../../../statics/frontend_links.statics';
import { RecordPermissionRequest } from '../../models/record_permission.model';

@Component({
    selector: 'app-record-deletion-requests',
    templateUrl: './record-deletion-requests.component.html',
    styleUrls: ['./record-deletion-requests.component.scss']
})
export class RecordDeletionRequestsComponent implements OnInit {
    recordDeletionRequests: Observable<RecordDeletionRequest[]>;

    toProcessColumns = [
        "request_from",
        "record",
        "requested",
        "state",
        "explanation",
        "accept"
    ];

    alreadyProcessedColumns = [
        "request_from",
        "record",
        "requested",
        "state",
        "processor",
        "processed_on"
    ];

    constructor(private recordSB: RecordsSandboxService, private router: Router) {
    }

    ngOnInit() {
        this.recordSB.startLoadingRecordDeletionRequests();
        this.recordDeletionRequests = this.recordSB.getRecordDeletionRequests();
    }

    onUserClick(user: RestrictedUser) {
        this.router.navigateByUrl(GetProfileFrontUrl(user));
    }

    onRequestClick(request: RecordDeletionRequest) {
        this.router.navigateByUrl(GetRecordFrontUrl(request.record));
    }

    admitRequest(request: RecordDeletionRequest) {
        this.recordSB.admitRecordDeletionRequest(request);
    }

    declineRequest(request: RecordDeletionRequest) {
        this.recordSB.declineRecordDeletionRequest(request);
    }
}
