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

import { RestrictedGroup } from '../../core/models/group.model';

export enum FolderPermissionFrom {
    Parent,
    Children
}

export class FolderPermission {
    constructor(
        public id: string,
        public group: RestrictedGroup,
        public permission: string,
        public folderId: string,
        public folderPath: string,
        public folderName: string,
        public from: FolderPermissionFrom
    ) {
        this.id = id;
        this.group = group;
        this.permission = permission;
        this.folderId = folderId;
        this.folderPath = folderPath;
        this.folderName = folderName;
        this.from = from;
    }

    static getFolderPermissionFromJson(json: any, from: FolderPermissionFrom): FolderPermission {
        return new FolderPermission(
            json.id,
            new RestrictedGroup(json.group_has_permission.id, json.group_has_permission.name),
            json.permission.name,
            json.folder.id,
            json.folder.path,
            json.folder.name,
            from
        )
    }

    static getFolderPermissionsFromJsonArray(jsonArray: any, from: FolderPermissionFrom): FolderPermission[] {
        const folderPermissions: FolderPermission[] = [];
        Object.values(jsonArray).map(folderPermissionJson => {
            folderPermissions.push(FolderPermission.getFolderPermissionFromJson(folderPermissionJson, from));
        });
        return folderPermissions;
    }
}
