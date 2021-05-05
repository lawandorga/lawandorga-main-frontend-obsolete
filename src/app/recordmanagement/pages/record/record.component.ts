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
import { FullClient } from '../../models/client.model';
import axios, { DjangoError } from 'src/app/shared/services/axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { AxiosError, AxiosResponse } from 'axios';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, HasUnsaved, OnDestroy {
  id: string;
  type: string;
  loading = true;

  @ViewChild(FullRecordDetailComponent) child: FullRecordDetailComponent;

  record: FullRecord;
  recordErrors: DjangoError;
  recordFields = [
    {
      label: 'Token',
      type: 'text',
      tag: 'input',
      name: 'record_token',
      required: true,
    },
    {
      label: 'First Contact Date',
      type: 'text',
      tag: 'datepicker',
      name: 'first_contact_date',
      required: false,
    },
    {
      label: 'Last Contact Date',
      type: 'text',
      tag: 'datepicker',
      name: 'last_contact_date',
      required: false,
    },
    {
      label: 'First Consultation',
      type: 'text',
      tag: 'datepicker',
      name: 'first_consultation',
      required: false,
    },
    {
      label: 'Official Note',
      type: 'text',
      tag: 'input',
      name: 'official_note',
      required: false,
    },
    {
      label: 'Record Consultants',
      tag: 'select-multiple',
      name: 'working_on_record',
      required: true,
      options: [],
    },
    {
      label: 'Record Tags',
      tag: 'select-multiple',
      name: 'tagged',
      required: true,
      options: [],
    },
    {
      label: 'State',
      tag: 'select',
      name: 'state',
      required: true,
      options: [
        {
          id: 'op',
          name: 'Open',
        },
        {
          id: 'cl',
          name: 'Closed',
        },
        {
          id: 'wa',
          name: 'Waiting',
        },
        {
          id: 'wo',
          name: 'Working',
        },
      ],
    },
    {
      label: 'Note',
      type: 'text',
      tag: 'input',
      name: 'note',
      required: false,
    },
    {
      label: 'Consultant Team',
      type: 'text',
      tag: 'input',
      name: 'consultant_team',
      required: false,
    },
    {
      label: 'Lawyer',
      type: 'text',
      tag: 'input',
      name: 'lawyer',
      required: false,
    },
    {
      label: 'Related Persons',
      type: 'text',
      tag: 'input',
      name: 'related_persons',
      required: false,
    },
    {
      label: 'Contact',
      type: 'text',
      tag: 'input',
      name: 'contact',
      required: false,
    },
    {
      label: 'BAMF Token',
      type: 'text',
      tag: 'input',
      name: 'bamf_token',
      required: false,
    },
    {
      label: 'Foreign Token',
      type: 'text',
      tag: 'input',
      name: 'foreign_token',
      required: false,
    },
    {
      label: 'First Correspondence',
      type: 'text',
      tag: 'input',
      name: 'first_correspondence',
      required: false,
    },
    {
      label: 'Next Steps',
      type: 'text',
      tag: 'input',
      name: 'next_steps',
      required: false,
    },
    {
      label: 'Status Described',
      type: 'text',
      tag: 'input',
      name: 'status_described',
      required: false,
    },
    {
      label: 'Additional Facts',
      type: 'text',
      tag: 'input',
      name: 'additional_facts',
      required: false,
    },
  ];

  client: FullClient;
  clientErrors: DjangoError;
  clientFields = [
    {
      label: 'Name',
      type: 'text',
      tag: 'input',
      name: 'name',
      required: true,
    },
    {
      label: 'Birthday',
      tag: 'datepicker',
      name: 'birthday',
      required: false,
    },
    {
      label: 'Origin Country',
      tag: 'select',
      name: 'origin_country',
      required: true,
      options: [],
    },
    {
      label: 'Phone',
      type: 'tel',
      tag: 'input',
      name: 'phone_number',
      required: false,
    },
    {
      label: 'Note',
      type: 'text',
      tag: 'input',
      name: 'note',
      required: false,
    },
  ];

  constructor(private recordSB: RecordsSandboxService, private route: ActivatedRoute, private coreSB: CoreSandboxService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loading = true;
      this.id = params['id'] as string;
      this.recordSB.loadAndGetSpecialRecord(this.id).subscribe((special_record) => {
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

    axios
      .get('api/records/consultants')
      .then((response: AxiosResponse<RestrictedUser[]>) => (this.recordFields[5].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get('api/records/record_tags/')
      .then((response: AxiosResponse<OriginCountry[]>) => (this.recordFields[6].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get('api/records/origin_countries/')
      .then((response: AxiosResponse<OriginCountry[]>) => (this.clientFields[2].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get(`api/records/records/${this.id}/`)
      .then((response: AxiosResponse) => {
        this.record = response.data.record;
        this.client = response.data.client;
      })
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
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
