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
import { FolderPermission, FolderPermissionFrom } from '../../models/folder_permission.model';
import { FilesSandboxService } from '../../services/files-sandbox.service';
import { Router } from '@angular/router';
import { TableEntry } from '../../models/table-entry.model';
import { MatDialog } from '@angular/material/dialog';
import { AddPermissionForFolderComponent } from '../add-permission-for-folder/add-permission-for-folder.component';
import { HasPermission, Permission } from '../../../core/models/permission.model';
import {
    PERMISSION_MANAGE_FOLDER_PERMISSIONS_RLC,
    PERMISSION_READ_ALL_FOLDERS_RLC,
    PERMISSION_WRITE_ALL_FOLDERS_RLC
} from '../../../statics/permissions.statics';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import {
    GetFolderFrontUrlAbsolute,
    GetGroupFrontUrl
} from '../../../statics/frontend_links.statics';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';

@Component({
    selector: 'app-table-entry-information-folder-permission',
    templateUrl: './table-entry-information-folder-permission.component.html',
    styleUrls: ['./table-entry-information-folder-permission.component.scss']
})
export class TableEntryInformationFolderPermissionComponent implements OnInit {
    @Input()
    folderEntry: TableEntry;

    folderPermissions: Observable<FolderPermission[]>;
    folderHasPermissions: Observable<HasPermission[]>;

    columns = ['permission', 'group_name', 'action'];
    columnsHas = ['permission', 'group_name'];

    permissionFromChildren = FolderPermissionFrom.Children;
    PERMISSION_WRITE_ALL_ID: string;
    PERMISSION_READ_ALL_ID: string;
    PERMISSION_MANAGE_ID: string;

    groups: any;

    constructor(
        private coreSB: CoreSandboxService,
        private fileSB: FilesSandboxService,
        private router: Router,
        public dialog: MatDialog,
        private sharedSB: SharedSandboxService
    ) {}

    ngOnInit() {
        this.coreSB.startLoadingGroups();
        this.folderPermissions = this.fileSB.getFolderPermissions();
        this.folderHasPermissions = this.fileSB.getFolderHasPermissions();
        this.coreSB.getAllPermissions().subscribe((permissions: Permission[]) => {
            for (const permission of permissions) {
                if (permission.name === PERMISSION_WRITE_ALL_FOLDERS_RLC) {
                    this.PERMISSION_WRITE_ALL_ID = permission.id;
                } else if (permission.name === PERMISSION_READ_ALL_FOLDERS_RLC) {
                    this.PERMISSION_READ_ALL_ID = permission.id;
                } else if (permission.name === PERMISSION_MANAGE_FOLDER_PERMISSIONS_RLC) {
                    this.PERMISSION_MANAGE_ID = permission.id;
                }
            }
        });
        this.coreSB.getGroups(false).subscribe((groups: any) => {
            this.groups = groups;
        });
    }

    onAddFolderPermissionClick() {
        this.dialog.open(AddPermissionForFolderComponent, { data: this.folderEntry });
    }

    onRemoveFolderPermissionClick(folderPermission: FolderPermission) {
        this.sharedSB.openConfirmDialog(
            {
                confirmLabel: 'delete',
                cancelLabel: 'cancel',
                title: 'sure?',
                description: `are you sure you want to remove permission ${folderPermission.permission} from group ${folderPermission.group.name}?`,
                confirmColor: 'warn'
            },
            confirm => {
                if (confirm) {
                    this.fileSB.startDeletingFolderPermission(folderPermission);
                }
            }
        );
    }

    onFolderPermissionGoToFolderClick(folderPermission: FolderPermission) {
        this.router
            .navigateByUrl(GetFolderFrontUrlAbsolute(folderPermission.folderPath))
            .catch(error => {
                console.log('error at redirecting: ', error);
            });
    }

    onGroupClick(hasPermission: HasPermission) {
        this.router.navigateByUrl(GetGroupFrontUrl(hasPermission.groupHas));
    }
}
