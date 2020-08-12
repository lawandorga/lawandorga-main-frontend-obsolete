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
import { NOTIFICATION_GROUPS_API_URL } from '../../../statics/api_urls.statics';
import { NotificationGroup } from '../../models/notification_group.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notification-groups-list.component.html',
    styleUrls: ['./notification-groups-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            // transition('expanded <=> collapsed', animate('290ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
            transition('collapsed <=> expanded', animate('300ms ease-in'))
            // transition('expanded <=> collapsed', animate('1000ms ease-in'))
        ])
    ]
})
export class NotificationGroupsListComponent implements AfterViewInit {
    columns = ['read', 'created', 'text'];

    data: NotificationGroup[] = [];
    expandedElement: NotificationGroup | null;
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
                    console.log('response: ', data);
                    this.results_length = data.count;
                    return data;
                }),
                catchError(error => {
                    console.log('error: ', error);
                    return [];
                })
            )
            .subscribe((data: NotificationResponse) => {
                this.data = NotificationGroup.getNotificationGroupsFromJsonArray(data);
            });
    }

    getNotifications(
        limit: number,
        offset: number,
        sort_active: string,
        sort_direction: string
    ): Observable<NotificationResponse> {
        const requestUrl = `${NOTIFICATION_GROUPS_API_URL}?limit=${limit}&offset=${offset}&sort=${sort_active}&sortdirection=${sort_direction}`;
        return this.httpClient.get<NotificationResponse>(requestUrl);
    }

    onReadClick(notification: Notification): void {
        // const toPost = {
        //     read: !notification.read
        // };
        // this.httpClient
        //     .patch(`${NOTIFICATIONS_API_URL}${notification.id}/`, toPost)
        //     .subscribe(response => {
        //         if (notification.read) {
        //             this.coreSB.incrementNotificationCounter();
        //         } else {
        //             this.coreSB.decrementNotificationCounter();
        //         }
        //         this.change.emit();
        //     });
    }

    onNotificationClick(notification: Notification): void {
        //     if (
        //         notification.event_subject === NotificationEventSubject.RECORD ||
        //         notification.event_subject === NotificationEventSubject.RECORD_DOCUMENT ||
        //         notification.event_subject === NotificationEventSubject.RECORD_MESSAGE
        //     ) {
        //         this.router.navigateByUrl(GetRecordFrontUrl(notification.ref_id));
        //     }
    }
}

export interface NotificationResponse {
    results: NotificationGroup[];
    count: number;
    next: string;
    previous: string;
}
