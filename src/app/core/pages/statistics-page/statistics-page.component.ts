/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2021  Dominik Walser
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

import { Component, OnInit } from '@angular/core';
import { StatisticsSandboxService } from '../../services/statistics-sandbox.service';

@Component({
    selector: 'app-statistics-page',
    templateUrl: './statistics-page.component.html',
    styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit {
    view: any[] = [700, 400];
    single: any[];
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    statistics = {
        record_tags: {
            values: [],
            empty: []
        },
        records: {
            total: {
                overall: 0,
                open: 0,
                closed: 0,
                waiting: 0,
                working: 0
            }
        }
    };

    constructor(private statisticsSB: StatisticsSandboxService) {}

    ngOnInit(): void {
        this.statisticsSB.getRecordStatistics().subscribe(response => {
            console.log('response from statistics: ', response);
            // this.

            this.statistics.record_tags.values = response.tags.filter(
                (entry: any) => entry.value > 0
            );
            this.statistics.record_tags.empty = response.tags.filter(
                (entry: any) => entry.value === 0
            );

            this.statistics.records = response.records;

            console.log('statistics', this.statistics);
        });
    }

    onSelect(event) {
        console.log(event);
    }
}
