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
import { Observable } from 'rxjs';
import { FolderPermission } from '../../models/folder_permission.model';
import { FilesSandboxService } from '../../services/files-sandbox.service';
import { Router } from '@angular/router';
import { TableEntry } from '../../models/table-entry.model';
import { MatDialog } from '@angular/material/dialog';
import { AddPermissionForFolderComponent } from '../add-permission-for-folder/add-permission-for-folder.component';

@Component({
    selector: 'app-table-entry-information-folder-permission',
    templateUrl: './table-entry-information-folder-permission.component.html',
    styleUrls: ['./table-entry-information-folder-permission.component.scss']
})
export class TableEntryInformationFolderPermissionComponent implements OnInit {
    @Input()
    folderEntry: TableEntry;

    folderPermissions: Observable<FolderPermission[]>;

    columns = ['icon', 'group_name', 'action'];

    constructor(private fileSB: FilesSandboxService, private router: Router, public dialog: MatDialog) {}

    ngOnInit() {
        this.folderPermissions = this.fileSB.getFolderPermissions();
    }

    getIconToShow(folderPermission: FolderPermission): string {
        if (folderPermission.id === '-1'){
            return 'general';
        } else if (folderPermission.permission === 'see'){
            return 'down';
        } else if (folderPermission.folderId !== this.folderEntry.id){
            return 'up';
        } else {
            return 'delete'
        }
    }

    onAddFolderPermissionClick(){
        console.log('addFolderPermissionClick');
        this.dialog.open(AddPermissionForFolderComponent, {data: this.folderEntry});
    }
}
