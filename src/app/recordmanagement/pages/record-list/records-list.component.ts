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

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { Subscription } from 'rxjs';
import { RestrictedRecord } from '../../models/record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../models/tag.model';
import { GetRecordFrontUrl, GetRecordListFrontUrl } from '../../../statics/frontend_links.statics';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';

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
        private coreSB: CoreSandboxService,
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
                this.paginator.pageSize = Number(queryParams.get('limit'));
                this.searchParams = {
                    filter: queryParams.get('filter'),
                    sort: queryParams.get('sort'),
                    sort_direction: queryParams.get('sortdirection'),
                    limit: Number(queryParams.get('limit')),
                    offset: Number(queryParams.get('offset'))
                };
                if (this.searchParams.sort === 'token') {
                    this.searchParams.sort = 'record_token';
                }
                // console.log('search params: ', this.searchParams);
                this.recordsSandbox.startLoadingRecords(this.searchParams);
            })
        );

        this.subscriptions.push(
            this.recordsSandbox.getRecords(false).subscribe((records: RestrictedRecord[]) => {
                this.dataSource = records;
            })
        );
        this.subscriptions.push(
            this.coreSB.getResultsLength().subscribe((results_length: number) => {
                this.results_length = results_length;
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
