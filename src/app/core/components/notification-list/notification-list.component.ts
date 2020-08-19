/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
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

import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import {
    NOTIFICATION_GROUPS_API_URL,
    NOTIFICATIONS_API_URL
} from '../../../statics/api_urls.statics';
import { HttpClient } from '@angular/common/http';
import { NotificationGroup } from '../../models/notification_group.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    columns = [];

    @Input()
    notificationGroup: NotificationGroup;

    constructor(private httpClient: HttpClient, private coreSB: CoreSandboxService) {}

    ngOnInit() {
        this.columns = ['read1', 'created1', 'text1'];
    }

    onReadClick(notification: Notification): void {
        const toPost = {
            read: !notification.read
        };
        this.httpClient
            .patch(`${NOTIFICATIONS_API_URL}${notification.id}/`, toPost)
            .subscribe(response => {
                notification.read = !notification.read;
                if (!notification.read && this.notificationGroup.read) {
                    this.notificationGroup.read = false;
                    this.coreSB.incrementNotificationCounter();
                } else {
                    for (const current_notification of this.notificationGroup.notifications) {
                        if (!current_notification.read) {
                            return;
                        }
                    }
                    this.notificationGroup.read = true;
                    this.coreSB.decrementNotificationCounter();
                }
            });
    }
}
