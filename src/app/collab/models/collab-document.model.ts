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
import { TextDocumentVersion } from './text-document-version.model';

export class NameCollabDocument implements NameTextDocument {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public children: NameCollabDocument[]
    ) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.children = children;
    }

    static getNameCollabDocumentFromJson(json: any): NameCollabDocument {
        if (!json) {
            return null;
        }
        const parts = json.path.split('/');

        return new NameCollabDocument(
            json.pk ? Number(json.pk) : Number(json.id),
            parts[parts.length - 1],
            json.path,
            json.child_pages
                ? NameCollabDocument.getNameCollabDocumentsFromJsonArray(json.child_pages)
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

    getTotalCountOfChildren(): number {
        let counter = 0;
        for (const child of this.children) {
            counter += 1 + child.getTotalCountOfChildren();
        }
        return counter;
    }
}

export class CollabDocument extends NameCollabDocument implements TextDocument {
    constructor(
        id: number,
        name: string,
        path: string,
        children: NameCollabDocument[],
        public content: string,
        public creator: RestrictedUser,
        public created: Date,
        public last_editor: RestrictedUser,
        public last_edited: Date,
        public versions: TextDocumentVersion[]
    ) {
        super(id, name, path, children);
        this.content = content;
        this.creator = creator;
        this.created = created;
        this.last_editor = last_editor;
        this.last_edited = last_edited;
        this.versions = versions;
    }

    static getCollabDocumentFromJson(json: any): CollabDocument {
        const versions = TextDocumentVersion.getTextDocumentVersionsFromJsonArray(json.versions);

        return new CollabDocument(
            json.pk ? Number(json.pk) : Number(json.id),
            json.name,
            json.path,
            json.child_pages
                ? NameCollabDocument.getNameCollabDocumentsFromJsonArray(json.child_pages)
                : [],
            json.content,
            RestrictedUser.getRestrictedUserFromJson(json.creator),
            new Date(json.created),
            RestrictedUser.getRestrictedUserFromJson(json.last_editor),
            new Date(json.last_edited),
            versions
        );
    }
}
