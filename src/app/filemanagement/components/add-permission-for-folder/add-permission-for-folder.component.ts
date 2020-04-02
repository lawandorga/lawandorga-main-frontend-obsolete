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

import { Component, Inject, OnInit } from '@angular/core';
import { FilesSandboxService } from '../../services/files-sandbox.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { Observable } from 'rxjs';
import { RestrictedGroup } from '../../../core/models/group.model';
import { tap } from 'rxjs/operators';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';
import { TableEntry } from '../../models/table-entry.model';

@Component({
    selector: 'app-add-permission-for-folder',
    templateUrl: './add-permission-for-folder.component.html',
    styleUrls: ['./add-permission-for-folder.component.scss']
})
export class AddPermissionForFolderComponent implements OnInit {
    groups: Observable<RestrictedGroup[]>;
    selectedGroup: RestrictedGroup = null;

    selectedPermission: string;

    constructor(
        private fileSB: FilesSandboxService,
        private coreSB: CoreSandboxService,
        public dialogRef: MatDialogRef<AddPermissionForFolderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log('received data: ', data);
    }

    ngOnInit() {
        this.coreSB.startLoadingGroups();
        this.groups = this.coreSB.getGroups().pipe(tap(results => {
            alphabeticalSorterByField(results, 'name')
        }));

    }

    selectedGroupChanged(selectedGroup: RestrictedGroup): void {
        this.selectedGroup = selectedGroup;
        console.log('now selected; ', selectedGroup);
    }

    onCloseClick() {
        this.dialogRef.close();
    }

    onAddClick() {
        console.log('i want to add a permission for group ', this.selectedGroup);
        console.log('my folder is: ', this.data);
        // const entry = TableEntry(this.data);
        // this.fileSB.startCreatingFolderPermission(this.data, this.selectedGroup, 'read');
    }
}
