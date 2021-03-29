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

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-statistics-number',
    templateUrl: './statistics-number.component.html',
    styleUrls: ['./statistics-number.component.scss']
})
export class StatisticsNumberComponent implements OnInit {
    @Input() value: number;
    @Input() title: string;
    @Input() description: string;

    constructor() {}

    ngOnInit(): void {}
}
