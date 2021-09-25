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

import { Component, OnInit } from '@angular/core';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from '../../../core/models/user.model';
import { Tag } from '../../models/tag.model';
import { DjangoError } from 'src/app/shared/services/axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FullRecord } from '../../models/record.model';

@Component({
  selector: 'app-add-record',
  templateUrl: './create-record.component.html',
})
export class CreateRecordComponent implements OnInit {
  originCountries: OriginCountry[];
  tags: Tag[];
  errors: DjangoError;
  fields = [
    {
      label: 'Client',
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
      label: 'Client Origin Country',
      tag: 'select',
      name: 'origin_country',
      required: false,
      options: [],
    },
    {
      label: 'Client Phone',
      type: 'tel',
      tag: 'input',
      name: 'phone_number',
      required: false,
    },
    {
      label: 'Client Note',
      type: 'text',
      tag: 'input',
      name: 'note',
      required: false,
    },
    {
      label: 'Record Token',
      type: 'text',
      tag: 'input',
      name: 'record_token',
      required: true,
    },
    {
      label: 'Record Contact Date',
      type: 'text',
      tag: 'datepicker',
      name: 'first_contact_date',
    },
    {
      label: 'Record Consultants',
      tag: 'select-multiple',
      name: 'working_on_record',
      required: true,
      options: [],
    },
    {
      label: 'Tags',
      tag: 'select-multiple',
      name: 'tags',
      required: true,
      options: [],
    },
    {
      label: 'Record Note',
      type: 'text',
      tag: 'input',
      name: 'record_note',
      required: false,
    },
  ];
  processing = false;

  constructor(private coreSB: CoreSandboxService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('api/records/origin_countries/').subscribe((response: OriginCountry[]) => (this.fields[2].options = response));
    this.http.get('api/records/tags/').subscribe((response: Tag[]) => (this.fields[8].options = response));
    this.http.get('api/records/consultants/').subscribe((response: RestrictedUser[]) => (this.fields[7].options = response));
  }

  onSend(values: FullRecord): void {  // eslint-disable-line
    this.processing = true;
    this.http.post('api/records/records/', values).subscribe(
      () => {
        this.coreSB.showSuccessSnackBar('Record was created.');
        void this.router.navigate(['/records/']);
      },
      (error: HttpErrorResponse) => {
        this.processing = false;
        this.errors = error.error as DjangoError;
      }
    );
  }
}
