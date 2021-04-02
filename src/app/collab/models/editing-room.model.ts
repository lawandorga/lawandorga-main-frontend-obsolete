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

export class EditingRoom {
    constructor(
        public id: number,
        public password: string,
        public room_id: string,
        public created: Date,
        public document_id: number
    ) {
        this.id = id;
        this.password = password;
        this.room_id = room_id;
        this.created = created;
        this.document_id = document_id;
    }

    static getEditingRoomFromJson(json: any): EditingRoom {
        return new EditingRoom(
            json.id,
            json.password,
            json.room_id,
            new Date(json.created),
            json.document
        );
    }
}
