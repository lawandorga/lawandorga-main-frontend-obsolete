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

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
    columns = ['id', 'read', 'created', 'source_user', 'text'];

    dataSource: MatTableDataSource<Notification>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    notificationsSubscription: Subscription;

    constructor(private coreSB: CoreSandboxService, private router: Router) {
    }

    ngOnInit() {
        // this.notificationsSubscription = this.coreSB.getNotifications().subscribe((notifications: Notification[]) => {
        //     this.dataSource = new MatTableDataSource(notifications);
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        // });
    }

    ngOnDestroy() {
        // this.notificationsSubscription.unsubscribe();
    }

}
