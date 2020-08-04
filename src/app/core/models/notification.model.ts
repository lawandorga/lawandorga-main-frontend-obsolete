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

import { RestrictedUser } from './user.model';
import { NotificationTextBuilderHelper } from '../services/notification-text-builder.helper';

export class Notification {
    public text: string;

    constructor(
        public id: string,
        public source_user: RestrictedUser,
        public event_subject: string,
        public event: string,
        public ref_id: string,
        public ref_text: string,
        public read: boolean,
        public created: Date
    ) {
        this.id = id;
        this.source_user = source_user;
        this.event_subject = event_subject;
        this.event = event;
        this.ref_id = ref_id;
        this.ref_text = ref_text;
        this.read = read;
        this.text = NotificationTextBuilderHelper.generateNotificationText(
            event_subject,
            event,
            ref_text,
            this.source_user.name
        );
    }

    static getNotificationFromJson(json: {
        id;
        source_user;
        event_subject;
        event;
        ref_id;
        ref_text;
        read;
        created;
    }): Notification {
        return new Notification(
            json.id,
            RestrictedUser.getRestrictedUserFromJson(json.source_user),
            json.event_subject,
            json.event,
            json.ref_id,
            json.ref_text,
            json.read,
            new Date(json.created)
        );
    }

    static getNotificationsFromJsonArray(jsonArray): Notification[] {
        const notifications: Notification[] = [];
        Object.values(jsonArray).map(
            (jsonNotification: {
                id;
                source_user;
                event_subject;
                event;
                ref_id;
                ref_text;
                read;
                created;
            }) => {
                notifications.push(Notification.getNotificationFromJson(jsonNotification));
            }
        );
        return notifications;
    }
}
