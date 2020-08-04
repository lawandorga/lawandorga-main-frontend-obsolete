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


import { NotificationEvent, NotificationEventSubject } from '../models/notification.enum';

export class NotificationTextBuilderHelper{
    static generateNotificationText(event_subject: string, event: string, ref_text: string, source_user_name: string): string {
        if (event_subject === NotificationEventSubject.RECORD && event === NotificationEvent.CREATED){
            return `You were assigned as Consultant for Record ${ref_text}`;
        }
        const text = `${source_user_name} ${event.toLowerCase()} ${event_subject.toLowerCase().replace("_", " ")} ${ref_text}`;
        return text;
    }
}
