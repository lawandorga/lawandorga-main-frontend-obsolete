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

@Component({
    selector: 'app-record-deletion-requests',
    templateUrl: './record-deletion-requests.component.html',
    styleUrls: ['./record-deletion-requests.component.scss']
})
export class RecordDeletionRequestsComponent implements OnInit {
    recordDeletionRequests: Observable<RecordDeletionRequest[]>;

    constructor(private recordSB: RecordsSandboxService, private router: Router) {
    }

    ngOnInit() {
        this.recordSB.startLoadingRecordDeletionRequests();
    }
}
