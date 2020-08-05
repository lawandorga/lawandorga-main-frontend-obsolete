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

export enum NotificationEventSubject {
    RECORD = 'RECORD',
    RECORD_MESSAGE = 'RECORD_MESSAGE',
    RECORD_DOCUMENT = 'RECORD_DOCUMENT',
    RECORD_PERMISSION_REQUEST = 'RECORD_PERMISSION_REQUEST',
    GROUP = 'GROUP',
    FILE = 'FILE'
}

export enum NotificationEvent {
    CREATED = 'CREATED',
    DELETED = 'DELETED',
    MOVED = 'MOVED',
    UPDATED = 'UPDATED',
    ADDED = 'ADDED',
    REMOVED = 'REMOVED'
}
