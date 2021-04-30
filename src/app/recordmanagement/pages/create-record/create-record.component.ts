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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { SelectClientDialogComponent } from '../../components/select-client-dialog/select-client-dialog.component';
import { FullClient } from '../../models/client.model';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from '../../../core/models/user.model';
import { Tag } from '../../models/tag.model';
import { Observable } from 'rxjs';
import { dateInPastValidator } from '../../../statics/validators.statics';
import { tap } from 'rxjs/operators';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';
import { DjangoError } from 'src/app/shared/services/axios';
import axios from '../../../shared/services/axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { AxiosError, AxiosResponse } from 'axios';

@Component({
  selector: 'app-add-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss'],
})
export class CreateRecordComponent implements OnInit {
  createRecordForm: FormGroup;
  client: FullClient;

  allConsultants: Observable<RestrictedUser[]>;
  consultantErrors: any;
  selectedConsultants: RestrictedUser[];

  allCountries: Observable<OriginCountry[]>;
  originCountryError: any;
  originCountry: OriginCountry;
  givenOriginCountry: OriginCountry;

  allRecordTags: Observable<Tag[]>;
  recordTagErrors: any;
  selectedRecordTags: Tag[];

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
      required: true,
    },
    {
      label: 'Client Origin Country',
      tag: 'select',
      name: 'description',
      required: true,
      options: [],
    },
    {
      label: 'Client Phone',
      type: 'tel',
      tag: 'input',
      name: 'phone',
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
      name: 'token',
      required: false,
    },
    {
      label: 'Contact Date',
      type: 'text',
      tag: 'datepicker',
      name: 'token',
      required: false,
    },
    {
      label: 'Consultants',
      tag: 'select-multiple',
      name: 'consultants',
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
      name: 'note',
      required: false,
    },
  ];

  constructor(private recordSB: RecordsSandboxService, private coreSB: CoreSandboxService, public dialog: MatDialog) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);

    this.createRecordForm = new FormGroup({
      first_contact_date: new FormControl(new Date(), dateInPastValidator),
      client_birthday: new FormControl(date, dateInPastValidator),
      // client_birthday: new FormControl(date),
      client_name: new FormControl('', [Validators.required]),
      client_phone_number: new FormControl(''),
      client_note: new FormControl(''),
      record_token: new FormControl('', [Validators.required]),
      record_note: new FormControl(''),
    });

    this.allConsultants = this.recordSB.getConsultants().pipe(
      tap((results) => {
        alphabeticalSorterByField(results, 'name');
      })
    );
    this.allCountries = this.recordSB.getOriginCountries().pipe(
      tap((results) => {
        alphabeticalSorterByField(results, 'name');
      })
    );
    this.allRecordTags = this.recordSB.getRecordTags().pipe(
      tap((results) => {
        alphabeticalSorterByField(results, 'name');
      })
    );
  }

  ngOnInit(): void {
    axios
      .get('api/records/origin_countries/')
      .then((response: AxiosResponse<OriginCountry[]>) => (this.fields[2].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get('api/records/record_tags/')
      .then((response: AxiosResponse<OriginCountry[]>) => (this.fields[8].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get('api/records/consultants')
      .then((response: AxiosResponse<RestrictedUser[]>) => (this.fields[7].options = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  onClientBirthdayChange(event: MatDatepickerInputEvent<Date>) {
    // const birthday = this.createRecordForm.get("client_birthday").searchValue;
    // if (birthday !== null){
    //     this.recordSB.loadClientPossibilities(new Date(this.createRecordForm.get("client_birthday").searchValue));
    //     this.openSelectClientDialog();
    // }
  }

  selectedConsultantsChanged(selectedConsultants) {
    this.selectedConsultants = selectedConsultants;
    if (selectedConsultants.length <= 1) {
      this.consultantErrors = { null: 'true' };
    } else {
      this.consultantErrors = null;
    }
  }

  selectedCountryChanged(selectedCountry) {
    this.originCountry = selectedCountry;
  }

  selectedRecordTagsChanged(selectedRecordTags) {
    this.selectedRecordTags = selectedRecordTags;
    if (selectedRecordTags.length === 0) {
      this.recordTagErrors = { null: 'true' };
    } else {
      this.recordTagErrors = null;
    }
  }

  openSelectClientDialog() {
    const dialogRef = this.dialog.open(SelectClientDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result !== -1) {
          this.client = this.recordSB.getSpecialPossibleClient(result);
          this.originCountry = this.recordSB.getOriginCountryById(this.client.origin_country);
          this.givenOriginCountry = this.originCountry;
          this.setClientFields();
        } else {
          this.client = null;
          this.originCountry = null;
          this.givenOriginCountry = null;
          this.resetClientFields();
        }
      } else {
        this.client = null;
        this.originCountry = null;
        this.givenOriginCountry = null;
        this.resetClientFields();
      }
      this.recordSB.resetPossibleClients();
    });
  }

  setClientFields() {
    this.createRecordForm.controls['client_name'].setValue(this.client.name);
    this.createRecordForm.controls['client_phone_number'].setValue(this.client.phone_number);

    this.createRecordForm.controls['client_note'].setValue(this.client.note);

    this.createRecordForm.controls['client_name'].disable();
  }

  resetClientFields() {
    this.createRecordForm.controls['client_name'].setValue('');
    this.createRecordForm.controls['client_phone_number'].setValue('');
    this.createRecordForm.controls['client_note'].setValue('');

    this.createRecordForm.controls['client_name'].enable();
  }

  onAddRecordClick() {
    let invalid = false;
    if (!this.selectedRecordTags || this.selectedRecordTags.length < 1) {
      this.recordTagErrors = { null: 'true' };
      invalid = true;
    }
    if (!this.selectedConsultants || this.selectedConsultants.length < 2) {
      this.consultantErrors = { null: 'true' };
      invalid = true;
    }

    if (!invalid) {
      this.recordSB.createNewRecord(
        this.createRecordForm.value,
        this.client,
        this.originCountry,
        this.selectedConsultants,
        this.selectedRecordTags
      );
    }
  }
}
