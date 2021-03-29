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

import { RestrictedUser } from '../../core/models/user.model';
import { NameCollabDocument } from './collab-document.model';
import { TextDocumentVersion } from './text-document-version.model';

export interface NameTextDocument {
    id: number;
    name: string;
}

export class TextDocument implements NameTextDocument {
    constructor(
        public id: number,
        public name: string,
        public creator: RestrictedUser,
        public created: Date,
        public last_editor: RestrictedUser,
        public last_edited: Date,
        public versions: TextDocumentVersion[],
        public content: string,
        public read: boolean,
        public write: boolean
    ) {
        this.id = id;
        this.name = name;
        this.creator = creator;
        this.created = created;
        this.last_editor = last_editor;
        this.last_edited = last_edited;
        this.versions = versions;
        this.content = content;
        this.read = read;
        this.write = write;
    }

    static getTextDocumentFromJson(json: any): TextDocument {
        const versions = TextDocumentVersion.getTextDocumentVersionsFromJsonArray(json.versions);

        return new TextDocument(
            Number(json.id),
            json.name,
            RestrictedUser.getRestrictedUserFromJson(json.creator),
            new Date(json.created),
            RestrictedUser.getRestrictedUserFromJson(json.last_editor),
            new Date(json.last_edited),
            versions,
            '',
            json.read,
            json.write
        );
    }
}
