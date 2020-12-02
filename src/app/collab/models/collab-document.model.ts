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
import { NameTextDocument, TextDocument } from './text-document.model';

export class NameCollabDocument implements NameTextDocument {
    constructor(public id: number, public name: string, public children: NameCollabDocument[]) {
        this.id = id;
        this.name = name;
        this.children = children;
    }

    static getNameCollabDocumentFromJson(json: any): NameCollabDocument {
        if (!json) {
            return null;
        }

        return new NameCollabDocument(
            Number(json.pk),
            json.name,
            json.children
                ? NameCollabDocument.getNameCollabDocumentsFromJsonArray(json.children)
                : []
        );
    }

    static getNameCollabDocumentsFromJsonArray(jsonArray: any): NameCollabDocument[] {
        const documents: NameCollabDocument[] = [];
        Object.values(jsonArray).map(json => {
            documents.push(NameCollabDocument.getNameCollabDocumentFromJson(json));
        });
        return documents;
    }
}

export class CollabDocument extends NameCollabDocument implements TextDocument {
    constructor(
        id: number,
        name: string,
        children: NameCollabDocument[],
        public content: string,
        public creator: RestrictedUser,
        public created: Date,
        public last_editor: RestrictedUser,
        public last_edited: Date
    ) {
        super(id, name, children);
        this.content = content;
        this.creator = creator;
        this.created = created;
        this.last_editor = last_editor;
        this.last_edited = last_edited;
    }

    static getCollabDocumentFromJson(json: any): CollabDocument {
        return new CollabDocument(
            Number(json.id),
            json.name,
            json.children
                ? NameCollabDocument.getNameCollabDocumentsFromJsonArray(json.children)
                : [],
            json.content,
            RestrictedUser.getRestrictedUserFromJson(json.creator),
            new Date(json.created),
            RestrictedUser.getRestrictedUserFromJson(json.last_editor),
            new Date(json.last_edited)
        );
    }
}
