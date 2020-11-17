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
import {
    PERMISSION_PROCESS_RECORD_DELETION_REQUESTS,
    PERMISSION_PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS
} from '../../../statics/permissions.statics';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';

@Component({
    selector: 'app-deletion-requests',
    templateUrl: './deletion-requests.component.html',
    styleUrls: ['./deletion-requests.component.scss']
})
export class DeletionRequestsComponent implements OnInit {
    showRecordDeletionRequests = false;
    showRecordDocumentDeletionRequests = false;

    constructor(private coreSB: CoreSandboxService) {}

    ngOnInit(): void {
        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_PROCESS_RECORD_DELETION_REQUESTS,
            hasPermission => {
                this.showRecordDeletionRequests = hasPermission;
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS,
            hasPermission => {
                this.showRecordDocumentDeletionRequests = hasPermission;
            }
        );
    }
}
