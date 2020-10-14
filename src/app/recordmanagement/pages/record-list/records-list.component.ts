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
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { Observable, Subscription } from 'rxjs';
import { isRestrictedRecord, RestrictedRecord } from '../../models/record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../models/tag.model';
import {
    GetRecordFrontUrl,
    GetRecordSearchFrontUrl
} from '../../../statics/frontend_links.statics';
import { tap } from 'rxjs/internal/operators/tap';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-records',
    templateUrl: './records-list.component.html',
    styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit, OnDestroy {
    timeout = 400;

    columns = ['access', 'token', 'state', 'consultants', 'tags'];
    searchValue = '';
    timer = null;

    results_length = 0;

    subscriptions: Subscription[] = [];

    dataSource;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private recordsSandbox: RecordsSandboxService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.subscriptions.push(
            this.route.queryParamMap.subscribe(map => {
                console.log('search: ', map.get('search'));
                const params: SearchParamsInterface = {
                    filter: map.get('search'),
                    sort: map.get('sort'),
                    sort_direction: map.get('sort_direction'),
                    limit: Number(map.get('limit')),
                    offset: Number(map.get('offset'))
                };
                this.recordsSandbox.startLoadingRecords(params);

                // if (map.get('search')) {
                //     this.recordsSandbox.loadRecords(map.get('search'));
                //     this.searchValue = map.get('search');
                // } else {
                //     this.recordsSandbox.loadRecords();
                // }
            })
        );
    }

    ngOnInit() {
        this.subscriptions.push(
            this.recordsSandbox.getRecords().subscribe(records => {
                this.dataSource = new MatTableDataSource(records);
                this.dataSource.sort = this.sort;
            })
        );
    }

    onSearchClick() {
        if (this.searchValue && this.searchValue !== '') {
            this.router.navigateByUrl(GetRecordSearchFrontUrl(this.searchValue));
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
        this.router.navigateByUrl(GetRecordSearchFrontUrl(tag.name));
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }
}
