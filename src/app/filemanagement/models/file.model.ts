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

export class FullFile {
    constructor(
        public id: number,
        public name: string,
        public creator: RestrictedUser,
        public size: number,
        public created: Date,
        public last_edited: Date
    ) {
        this.id = id;
        this.name = name;
        this.creator = creator;
        this.created = created;
        this.last_edited = last_edited;
        this.size = size;
    }

    static getFullFileFromJson(json: any): FullFile{
        if (!json.creator){
            json.creator = {id: -1, name: ''}
        }
        return new FullFile(
            json.id,
            json.name,
            new RestrictedUser(json.creator.id, json.creator.name),
            json.size,
            new Date(json.created),
            new Date(json.last_edited)
        );
    }

    static getFullFilesFromJsonArray(jsonArray: any): FullFile[]{
        const fullFiles: FullFile[] = [];
        Object.values(jsonArray).map(fullFileJson => {
            fullFiles.push(FullFile.getFullFileFromJson(fullFileJson));
        });
        return fullFiles;
    }
}
