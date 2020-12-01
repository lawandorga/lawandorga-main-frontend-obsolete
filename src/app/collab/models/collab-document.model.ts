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

export class NameCollabDocument {
    constructor(public id: number, public name: string, public children: NameCollabDocument[]) {
        this.id = id;
        this.name = name;
        this.children = children;
    }

    static getNameCollabDocumentFromJson(json: any): NameCollabDocument {
        if (!json) {
            return null;
        }

        return json.children
            ? new NameCollabDocument(
                  json.pk,
                  json.name,
                  NameCollabDocument.getNameCollabDocumentsFromJsonArray(json.children)
              )
            : new NameCollabDocument(json.id, json.name, []);
        // return new NameCollabDocument(json.id, json.name);
    }

    static getNameCollabDocumentsFromJsonArray(jsonArray: any): NameCollabDocument[] {
        console.log('json array: ', jsonArray);
        const documents: NameCollabDocument[] = [];
        Object.values(jsonArray).map(json => {
            documents.push(NameCollabDocument.getNameCollabDocumentFromJson(json));
        });
        return documents;
    }
}
