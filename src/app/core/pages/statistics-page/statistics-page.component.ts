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

    last_edited_mock = [
        {
            name: 'today',
            value: 3
        },
        {
            name: 'last week',
            value: 6
        },
        {
            name: 'last month',
            value: 3
        }
    ];
    created_on_mock = [
        {
            name: 'today',
            value: 1
        },
        {
            name: 'last week',
            value: 3
        },
        {
            name: 'last month',
            value: 5
        },
        {
            name: 'last 6 months',
            value: 3
        }
    ];

    in_month_mocks = [
        {
            name: 'records closed in month',
            series: [
                {
                    name: '9/20',
                    value: 9
                },
                {
                    name: '10/20',
                    value: 5
                },
                {
                    name: '11/20',
                    value: 4
                },
                {
                    name: '12/20',
                    value: 6
                },
                {
                    name: '01/21',
                    value: 3
                },

                {
                    name: '02/21',
                    value: 1
                }
            ]
        },
        {
            name: 'records created in month',
            series: [
                {
                    name: '9/20',
                    value: 0
                },
                {
                    name: '10/20',
                    value: 0
                },
                {
                    name: '11/20',
                    value: 1
                },
                {
                    name: '12/20',
                    value: 2
                },
                {
                    name: '01/21',
                    value: 5
                },

                {
                    name: '02/21',
                    value: 4
                }
            ]
        }
    ];

    statistics = {
        record_tags: {
            values: [],
            empty: []
        },
        records: {
            overall: 0,
            states: [],
            last_edited: [],
            created_on: [],
            in_month: []
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
            this.statistics.records.created_on = this.created_on_mock.reverse();
            this.statistics.records.last_edited = this.last_edited_mock.reverse();
            this.statistics.records.in_month = this.in_month_mocks;

            console.log('statistics', this.statistics);
        });
    }

    onSelect(event) {
        console.log(event);
    }
}
