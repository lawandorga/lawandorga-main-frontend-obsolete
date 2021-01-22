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

import { RestrictedUser } from '../../core/models/user.model';

export class TextDocumentVersion {
    constructor(
        public id: number,
        public created: Date,
        public creator: RestrictedUser,
        public content: string,
        public is_draft: boolean,
        public anonymous: boolean
    ) {
        this.id = id;
        this.created = created;
        this.creator = creator;
        this.content = content;
        this.is_draft = is_draft;
        this.anonymous = anonymous;
    }

    static getTextDocumentVersionFromJson(json: any): TextDocumentVersion {
        return new TextDocumentVersion(
            Number(json.id),
            new Date(json.created),
            RestrictedUser.getRestrictedUserFromJson(json.creator),
            json.content ? json.content : '',
            json.is_draft,
            !json.content
        );
    }

    static getTextDocumentVersionsFromJsonArray(jsonArray: any): TextDocumentVersion[] {
        const versions: TextDocumentVersion[] = [];
        Object.values(jsonArray).map(json => {
            versions.push(TextDocumentVersion.getTextDocumentVersionFromJson(json));
        });
        return versions;
    }
}
