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

export class FolderPermission {
    constructor(
        public id: string,
        public group: RestrictedGroup,
        public permission: string,
        public folderId: string
    ) {
        this.id = id;
        this.group = group;
        this.permission = permission;
        this.folderId = folderId;
    }

    static getFolderPermissionFromJson(json: any, permission: string): FolderPermission {
        console.log('json: ', json);
        if (json.general){
            return new FolderPermission('-1', null, permission, '-1');
        }
        return new FolderPermission(
            json.id,
            new RestrictedGroup(json.group.id, json.group.name),
            permission,
            json.folder
        )
    }

    static getFolderPermissionsFromJsonArray(jsonArray: any, permission: string): FolderPermission[] {
        const folderPermissions: FolderPermission[] = [];
        console.log('jsonArray: ', jsonArray);
        Object.values(jsonArray).map(folderPermissionJson => {
            folderPermissions.push(FolderPermission.getFolderPermissionFromJson(folderPermissionJson, permission))
        });
        return folderPermissions;
    }
}
