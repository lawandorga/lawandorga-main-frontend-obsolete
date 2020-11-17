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
    static generateNotificationText(
        source_user_name: string,
        event_type: NotificationType,
        text: string
    ): string {
        if (event_type === NotificationType.RECORD__CREATED) {
            return `${source_user_name} created record`;
        }
        if (event_type === NotificationType.RECORD__UPDATED) {
            return `${source_user_name} updated ${
                text.split(',').length > 1 ? 'fields' : 'field'
            } ${text.length < 30 ? text.replace(',', ', ') : ''}`;
        }
        if (event_type === NotificationType.RECORD__DELETED) {
            return `${source_user_name} deleted record`;
        }
        if (event_type === NotificationType.RECORD__RECORD_MESSAGE_ADDED) {
            return `${source_user_name} wrote a new message`;
        }
        if (event_type === NotificationType.GROUP__ADDED_ME) {
            return `${source_user_name} added you to the group`;
        }
        if (event_type === NotificationType.GROUP__REMOVED_ME) {
            return `${source_user_name} removed you from the group`;
        }
        if (event_type === NotificationType.RECORD__RECORD_DOCUMENT_ADDED) {
            return `${source_user_name} added record document ${text}`;
        }
        if (event_type === NotificationType.RECORD__RECORD_DOCUMENT_MODIFIED) {
            return `${source_user_name} modified record document ${text}`;
        }
        if (event_type === NotificationType.RECORD_DELETION_REQUEST__REQUESTED) {
            return `${source_user_name} requested record deletion`;
        }
        if (event_type === NotificationType.RECORD_DELETION_REQUEST__ACCEPTED) {
            return `${source_user_name} accepted record deletion request`;
        }
        if (event_type === NotificationType.RECORD_DELETION_REQUEST__DECLINED) {
            return `${source_user_name} declined record deletion request`;
        }
        if (event_type === NotificationType.USER_REQUEST__REQUESTED) {
            return `${source_user_name} requested to join your rlc`;
        }
        if (event_type === NotificationType.USER_REQUEST__ACCEPTED) {
            return `${source_user_name} accepted the request`;
        }
        if (event_type === NotificationType.USER_REQUEST__DECLINED) {
            return `${source_user_name} declined the request`;
        }
        if (event_type === NotificationType.RECORD_PERMISSION_REQUEST__REQUESTED) {
            return `${source_user_name} asked to get access to record`;
        }
        if (event_type === NotificationType.RECORD_PERMISSION_REQUEST__ACCEPTED) {
            return `${source_user_name} accepted the request`;
        }
        if (event_type === NotificationType.RECORD_PERMISSION_REQUEST__DECLINED) {
            return `${source_user_name} declined the request`;
        }
        if (event_type === NotificationType.RECORD__ACCESS_DENIED) {
            return `${source_user_name} denied access to record`;
        }
        if (event_type === NotificationType.RECORD__DELETION_REQUEST_DENIED) {
            return `${source_user_name} denied record deletion request`;
        }
        if (event_type === NotificationType.RECORD__NEW_RECORD_PERMISSION) {
            return `${source_user_name} granted access to record`;
        }
        if (event_type === NotificationType.FOLDER__FILE_UPLOAD_ERROR) {
            return `file couldn't be uploaded ${text}`;
        }
        if (event_type === NotificationType.FOLDER__FILE_NOT_EXISTING) {
            return `download was not possible, file not existing ${text}`;
        }

        return 'text needs to be added';
    }
}
