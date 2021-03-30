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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STATISTICS_RECORDS_API_URL } from '../../statics/api_urls.statics';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsSandboxService {
    constructor(private http: HttpClient) {}

    getRecordStatistics(): Observable<any> {
        return this.http.get<any>(STATISTICS_RECORDS_API_URL);
    }
}
