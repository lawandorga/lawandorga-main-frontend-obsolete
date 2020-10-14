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

import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { merge, Observable, of, Subscription } from 'rxjs';
import { isRestrictedRecord, RestrictedRecord } from '../../models/record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../models/tag.model';
import {
    GetRecordFrontUrl,
    GetRecordListFrontUrl,
    GetRecordSearchFrontUrl
} from '../../../statics/frontend_links.statics';
import { tap } from 'rxjs/internal/operators/tap';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { NotificationGroup } from '../../../core/models/notification_group.model';

@Component({
    selector: 'app-records',
    templateUrl: './records-list.component.html',
    styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit, OnDestroy, AfterViewInit {
    timeout = 400;
    timer = null;

    columns = ['access', 'token', 'state', 'consultants', 'tags'];

    subscriptions: Subscription[] = [];

    dataSource: RestrictedRecord[] = [];
    searchValue = '';
    results_length = 0;
    searchParams: SearchParamsInterface;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private recordsSandbox: RecordsSandboxService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(event => {
            this.searchParams = {
                ...this.searchParams,
                sort: this.sort.active,
                sort_direction: this.sort.direction
            };
            this.router.navigateByUrl(GetRecordListFrontUrl(this.searchParams));
        });

        this.paginator.page.subscribe(event => {
            this.searchParams = {
                ...this.searchParams,
                offset: this.paginator.pageSize * this.paginator.pageIndex,
                limit: this.paginator.pageSize
            };
            this.router.navigateByUrl(GetRecordListFrontUrl(this.searchParams));
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.queryParamMap.subscribe(queryParams => {
                // console.log('search: ', queryParams.get('search'));
                this.searchValue = queryParams.get('filter');
                this.searchParams = {
                    filter: queryParams.get('filter'),
                    sort: queryParams.get('sort'),
                    sort_direction: queryParams.get('sort_direction'),
                    limit: Number(queryParams.get('limit')),
                    offset: Number(queryParams.get('offset'))
                };
                this.recordsSandbox.startLoadingRecords(this.searchParams);
            })
        );

        this.subscriptions.push(
            this.recordsSandbox.getRecords().subscribe((records: RestrictedRecord[]) => {
                this.dataSource = records;
            })
        );
    }

    onSearchClick() {
        if (this.searchValue && this.searchValue !== '') {
            this.searchParams = {
                ...this.searchParams,
                filter: this.searchValue
            };
            this.router.navigateByUrl(GetRecordListFrontUrl(this.searchParams));
        } else this.router.navigateByUrl(`records`);
    }

    onSearchChange(searchValue: string) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.fireSearch.bind(this), this.timeout);
    }

    fireSearch(): void {
        this.onSearchClick();
    }

    onRecordSelect(record: RestrictedRecord) {
        this.router.navigateByUrl(GetRecordFrontUrl(record));
    }

    onTagClick(tag: Tag) {
        this.searchParams = {
            ...this.searchParams,
            filter: tag.name
        };
        this.router.navigateByUrl(GetRecordListFrontUrl(this.searchParams));
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }
}
