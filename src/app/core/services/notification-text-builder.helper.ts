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

import { NotificationType } from '../models/notification.enum';

export class NotificationTextBuilderHelper {
    // static generateNotificationText(
    //     event_subject: string,
    //     event: string,
    //     ref_text: string,
    //     source_user_name: string
    // ): string {
    //     if (
    //         event_subject === NotificationEventSubject.RECORD &&
    //         event === NotificationEvent.CREATED
    //     ) {
    //         return `You were assigned as Consultant for Record ${ref_text}`;
    //     }
    //     if (event_subject === NotificationEventSubject.GROUP){
    //         if (event === NotificationEvent.ADDED)
    //             return `${source_user_name} added you to Group ${ref_text}`
    //         if (event === NotificationEvent.REMOVED)
    //             return `${source_user_name} removed you from Group ${ref_text}`
    //     }
    //
    //     return `${source_user_name} ${event.toLowerCase()} ${
    //         event_subject
    //             .toLowerCase()
    //             .replace('_', ' ')
    //     } ${ref_text}.`;
    // }

    static generateNotificationText(
        source_user_name: string,
        event_type: NotificationType,
        text: string
    ): string {
        if (event_type === NotificationType.RECORD__CREATED) {
            return `${source_user_name} created record`;
        }
        if (event_type === NotificationType.RECORD__UPDATED) {
            return `${source_user_name} updated fields`;
        }
        if (event_type === NotificationType.RECORD__RECORD_MESSAGE_ADDED) {
            return `${source_user_name} wrote a new message`;
        }

        return 'notification';
    }
}
