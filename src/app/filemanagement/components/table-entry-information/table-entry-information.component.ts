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

import { Component, Input, OnInit } from '@angular/core';
import { TableEntry } from '../../models/table-entry.model';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { PERMISSION_MANAGE_FOLDER_PERMISSIONS_RLC } from '../../../statics/permissions.statics';

@Component({
    selector: 'app-table-entry-information',
    templateUrl: './table-entry-information.component.html',
    styleUrls: ['./table-entry-information.component.scss']
})
export class TableEntryInformationComponent implements OnInit {
    @Input()
    entry: TableEntry;

    showPermissions = false;

    constructor(private coreSB: CoreSandboxService) {}

    ngOnInit() {
        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_MANAGE_FOLDER_PERMISSIONS_RLC,
            hasPermission => {
                if (this.showPermissions !== hasPermission) {
                    this.showPermissions = hasPermission;
                }
            }
        );
    }
}
