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

export enum FilesTypes {
    Folder,
    File
}

export class TableEntry {
    constructor(
        public id: string,
        public name: string,
        public type: FilesTypes,
        public creator: RestrictedUser,
        public size: number,
        public created: Date,
        public last_edited: Date,
        public numberOfFiles: number
    ) {
        this.id = id;
        this.name = name;
        this.creator = creator;
        this.size = size;
        this.created = created;
        this.last_edited = last_edited;
        this.type = type;
        this.numberOfFiles = numberOfFiles;
    }

    static getTableEntryFromJson(json: any, type: FilesTypes) {
        if (!json.creator){
            json.creator = {id: -1, name: ''}
        }
        return new TableEntry(
            json.id,
            json.name,
            type,
            new RestrictedUser(json.creator.id, json.creator.name),
            json.size,
            new Date(json.created),
            new Date(json.last_edited),
            type === FilesTypes.Folder ? json.number_of_files : -1
        )
    }

    static getTableEntriesFromJsonArray(jsonArray: any, type: FilesTypes): TableEntry[] {
        const entries: TableEntry[] = [];
        Object.values(jsonArray).map(entry => {
            entries.push(TableEntry.getTableEntryFromJson(entry, type));
        });
        return entries;
    }

    static getFolderTableEntryFromJson(json: any): TableEntry {
        return TableEntry.getTableEntryFromJson(json, FilesTypes.Folder);
    }

    static getFileTableEnrtyFromJson(json: any): TableEntry {
        return TableEntry.getTableEntryFromJson(json, FilesTypes.File);
    }

    static getFileTableEntriesFromJsonArray(jsonArray: any): TableEntry[] {
        return this.getTableEntriesFromJsonArray(jsonArray, FilesTypes.File);
    }

    static getFolderTableEntriesFromJsonArray(jsonArray: any): TableEntry[] {
        return this.getTableEntriesFromJsonArray(jsonArray, FilesTypes.Folder);
    }
}
