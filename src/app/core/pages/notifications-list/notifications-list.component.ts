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

import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { merge, Observable } from 'rxjs';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NOTIFICATIONS_API_URL } from '../../../statics/api_urls.statics';
import { NotificationEventSubject } from '../../models/notification.enum';
import { GetRecordFrontUrl } from '../../../statics/frontend_links.statics';
import { not } from 'rxjs/internal-compatibility';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements AfterViewInit {
    columns = ['read', 'created', 'text'];

    data: Notification[] = [];
    results_length = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    change = new EventEmitter();

    constructor(
        private coreSB: CoreSandboxService,
        private router: Router,
        private httpClient: HttpClient
    ) {}

    ngAfterViewInit() {
        merge(this.sort.sortChange, this.paginator.page, this.change)
            .pipe(
                startWith({}),
                switchMap(() => {
                    // this.isLoadingResults = true;
                    return this.getNotifications(
                        this.paginator.pageSize,
                        this.paginator.pageSize * this.paginator.pageIndex,
                        this.sort.active,
                        this.sort.direction
                    );
                }),
                map((data: NotificationResponse) => {
                    this.results_length = data.count;
                    return data;
                }),
                catchError(error => {
                    console.log('error: ', error);
                    return [];
                })
            )
            .subscribe((data: NotificationResponse) => {
                this.data = Notification.getNotificationsFromJsonArray(data.results);
            });
    }

    getNotifications(
        limit: number,
        offset: number,
        sort_active: string,
        sort_direction: string
    ): Observable<NotificationResponse> {
        const requestUrl = `${NOTIFICATIONS_API_URL}?limit=${limit}&offset=${offset}&sort=${sort_active}&sortdirection=${sort_direction}`;
        return this.httpClient.get<NotificationResponse>(requestUrl);
    }

    onReadClick(notification: Notification): void {
        const toPost = {
            read: !notification.read
        };
        this.httpClient
            .patch(`${NOTIFICATIONS_API_URL}${notification.id}/`, toPost)
            .subscribe(response => {
                if (notification.read) {
                    this.coreSB.incrementNotificationCounter();
                } else {
                    this.coreSB.decrementNotificationCounter();
                }
                this.change.emit();
            });
    }

    onNotificationClick(notification: Notification): void {
        if (
            notification.event_subject === NotificationEventSubject.RECORD ||
            notification.event_subject === NotificationEventSubject.RECORD_DOCUMENT ||
            notification.event_subject === NotificationEventSubject.RECORD_MESSAGE
        ) {
            this.router.navigateByUrl(GetRecordFrontUrl(notification.ref_id));
        }
    }
}

export interface NotificationResponse {
    results: Notification[];
    count: number;
    next: string;
    previous: string;
}
