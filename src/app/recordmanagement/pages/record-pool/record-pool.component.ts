/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
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
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-record-pool',
    templateUrl: './record-pool.component.html',
    styleUrls: ['./record-pool.component.scss']
})
export class RecordPoolComponent implements OnInit {
    consultants: number;
    records: number;
    users_enlistings: number;


    constructor(private recordSB: RecordsSandboxService) {
    }

    ngOnInit() {
        this.recordSB.startLoadingRecordPool();
        this.recordSB.getPoolConsultants().subscribe((consultants: number) => {
            this.consultants = consultants;
        });
        this.recordSB.getPoolRecords().subscribe((records: number) => {
            this.records = records;
        });
        this.recordSB.getUsersPoolEnlistings().subscribe((own_enlistings: number) => {
            this.users_enlistings = own_enlistings;
        });
    }

    onEnlistClick(){
        this.recordSB.startEnlistingPoolConsultant();
    }
}
