/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2021  Dominik Walser
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
import { NameCollabDocument } from './collab-document.model';

export enum CollabPermissionFrom {
    Parent,
    Direct,
    Children
}

export class CollabPermission {
    constructor(
        public id: number,
        public group: RestrictedGroup,
        public permission: string,
        public document: NameCollabDocument,
        public from: CollabPermissionFrom
    ) {
        this.id = id;
        this.group = group;
        this.permission = permission;
        this.document = document;
        this.from = from;
    }

    static getCollabPermissionFromJson(json: any, from: CollabPermissionFrom): CollabPermission {
        return new CollabPermission(
            json.id,
            new RestrictedGroup(json.group_id, json.grou_name),
            json.permission,
            NameCollabDocument.getNameCollabDocumentFromJson(json.document),
            from
        );
    }

    static getCollabPermissionFromJsonArray(
        jsonArray: any,
        from: CollabPermissionFrom
    ): CollabPermission[] {
        return Object.values(jsonArray).map(json => {
            return CollabPermission.getCollabPermissionFromJson(json, from);
        });
    }
}
