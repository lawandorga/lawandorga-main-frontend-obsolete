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
import { NotificationType } from './notification.enum';

export class Notification {
    public description_text: string;

    constructor(
        public id: string,
        public source_user: RestrictedUser,
        public type: string,
        public read: boolean,
        public created: Date,
        public text: string
    ) {
        this.id = id;
        this.source_user = source_user;
        this.type = type;
        this.created = created;
        this.text = '';
        this.read = read;
        this.description_text = NotificationTextBuilderHelper.generateNotificationText(
            source_user.name,
            NotificationType[type],
            text
        );
    }

    static getNotificationFromJson(json: {
        id;
        source_user;
        type;
        read;
        created;
        text;
    }): Notification {
        return new Notification(
            json.id,
            RestrictedUser.getRestrictedUserFromJson(json.source_user),
            json.type,
            json.read,
            new Date(json.created),
            json.text
        );
    }

    static getNotificationsFromJsonArray(jsonArray): Notification[] {
        const notifications: Notification[] = [];
        Object.values(jsonArray).map(
            (jsonNotification: { id; source_user; type; read; created; text }) => {
                notifications.push(Notification.getNotificationFromJson(jsonNotification));
            }
        );
        return notifications;
    }
}
