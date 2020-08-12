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

import { Notification } from './notification.model';

export class NotificationGroup {
    public description_text: string;

    constructor(
        public id: string,
        public last_activity: Date,
        public created: Date,
        public type: string,
        public read: boolean,
        public ref_id: string,
        public ref_text: string,
        public notifications: Notification[]
    ) {
        this.id = id;
        this.last_activity = last_activity;
        this.created = created;
        this.type = type;
        this.read = read;
        this.ref_id = ref_id;
        this.ref_text = ref_text;
        this.notifications = notifications;
    }

    static getNotificationGroupFromJson(json: {
        id;
        last_activity;
        created;
        type;
        read;
        ref_id;
        ref_text;
        notifications;
    }): NotificationGroup {
        return new NotificationGroup(
            json.id,
            new Date(json.last_activity),
            new Date(json.created),
            json.type,
            json.read,
            json.ref_id,
            json.ref_text,
            Notification.getNotificationsFromJsonArray(json.notifications)
        );
    }

    static getNotificationGroupsFromJsonArray(jsonArray): NotificationGroup[] {
        console.log('notificationGroup to convert: ', jsonArray);
        const notificationGroups: NotificationGroup[] = [];
        Object.values(jsonArray).map(
            (jsonNotification: {
                id;
                last_activity;
                created;
                type;
                read;
                ref_id;
                ref_text;
                notifications;
            }) => {
                console.log('notificationGroup single item to convert in list: ', jsonNotification);
                notificationGroups.push(
                    NotificationGroup.getNotificationGroupFromJson(jsonNotification)
                );
            }
        );
        return notificationGroups;
    }
}
