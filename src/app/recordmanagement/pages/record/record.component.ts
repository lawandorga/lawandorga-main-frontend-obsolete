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
import { FullRecord, RestrictedRecord } from '../../models/record.model';
import { ActivatedRoute, Params } from '@angular/router';
import { HasUnsaved } from '../../../core/services/can-have-unsaved.interface';
import { FullRecordDetailComponent } from '../../components/records/full-record-detail/full-record-detail.component';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit, HasUnsaved, OnDestroy {
    id: string;
    type: string;
    loading = true;

    @ViewChild(FullRecordDetailComponent) child: FullRecordDetailComponent;

    constructor(private recordSB: RecordsSandboxService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.loading = true;
            this.id = params['id'];
            this.recordSB.loadAndGetSpecialRecord(this.id).subscribe(special_record => {
                if (special_record.record !== null) {
                    this.loading = false;
                }
                if (special_record.client) {
                    this.type = 'FullRecord';
                } else {
                    this.type = 'RestrictedRecord';
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.recordSB.resetFullClientInformation();
    }

    hasUnsaved(): boolean {
        if (this.type === 'FullRecord') {
            return this.child.hasUnsaved();
        } else {
            return false;
        }
    }
}
