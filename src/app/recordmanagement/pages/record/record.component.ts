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
import { FullRecord } from '../../models/record.model';
import { ActivatedRoute, Params } from '@angular/router';
import { FullClient } from '../../models/client.model';
import { addToArray, DjangoError, removeFromArray, SubmitData } from 'src/app/shared/services/axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from 'src/app/core/models/user.model';
import { Message } from '../../models/message.model';
import { RecordDocument } from '../../models/record_document.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
})
export class RecordComponent implements OnInit {
  id: string;

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
      label: 'Official Note (Everybody can see this note)',
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
      tag: 'textarea',
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
      tag: 'textarea',
      name: 'first_correspondence',
      required: false,
    },
    {
      label: 'Next Steps',
      tag: 'textarea',
      name: 'next_steps',
      required: false,
    },
    {
      label: 'Status Described',
      type: 'text',
      tag: 'textarea',
      name: 'status_described',
      required: false,
    },
    {
      label: 'Additional Facts',
      type: 'text',
      tag: 'textarea',
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
      tag: 'textarea',
      name: 'note',
      required: false,
    },
  ];

  messageFields = [
    {
      label: 'Message',
      tag: 'textarea',
      name: 'message',
      required: false,
    },
  ];
  messageErrors: DjangoError;
  messages: Message[];
  messageData: { message: string };

  documentFields = [
    {
      label: 'File',
      type: 'file',
      tag: 'file',
      name: 'file',
      required: false,
    },
  ];
  documentErrors: DjangoError;
  documents: RecordDocument[];
  documentData: { file: string };

  constructor(
    private sharedSB: SharedSandboxService,
    private route: ActivatedRoute,
    private coreSB: CoreSandboxService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] as string;
    });

    this.http.get('api/records/consultants/').subscribe((response: RestrictedUser[]) => (this.recordFields[5].options = response));

    this.http.get('api/records/record_tags/').subscribe((response: OriginCountry[]) => (this.recordFields[6].options = response));

    this.http.get('api/records/origin_countries/').subscribe((response: OriginCountry[]) => (this.clientFields[2].options = response));

    this.getRecord(this.id);

    this.getMessages(this.id);

    this.getDocuments(this.id);
  }

  getMessages(id: string | number): void {
    this.http.get(`api/records/records/${id}/messages/`).subscribe((response: Message[]) => (this.messages = response));
  }

  getDocuments(id: string | number): void {
    this.http.get(`api/records/records/${id}/documents/`).subscribe((response: RecordDocument[]) => (this.documents = response));
  }

  getRecord(id: string | number): void {
    this.http.get(`api/records/records/${id}/`).subscribe((response: FullRecord) => {
      this.record = response;
      this.getClient(response.client);
    });
  }

  getClient(id: number): void {
    void this.http.get(`api/records/e_clients/${id}/`).subscribe((response: FullClient) => (this.client = response));
  }

  onClientSend(data: SubmitData): void {
    void this.http.patch(`api/records/e_clients/${this.client.id}/`, data).subscribe(
      (response: FullClient) => {
        this.client = response;
        this.coreSB.showSuccessSnackBar('Client saved successfully.');
      },
      (error: HttpErrorResponse) => (this.clientErrors = error.error as DjangoError)
    );
  }

  onRecordSend(data: SubmitData): void {
    void this.http.patch(`api/records/records/${this.record.id}/`, data).subscribe(
      (response: FullRecord) => {
        this.record = response;
        this.coreSB.showSuccessSnackBar('Record saved successfully.');
      },
      (error: HttpErrorResponse) => (this.recordErrors = error.error as DjangoError)
    );
  }

  onMessageSend(data: SubmitData): void {
    void this.http.post(`api/records/records/${this.record.id}/add_message/`, data).subscribe(
      (response: Message) => {
        this.messages = addToArray(this.messages, response) as Message[];
        this.messageData = { message: '' };
        this.coreSB.showSuccessSnackBar('Message saved successfully.');
      },
      (error: HttpErrorResponse) => (this.messageErrors = error.error as DjangoError)
    );
  }

  onDocumentSend(data: SubmitData): void {
    const formData = new FormData();
    // eslint-disable-next-line
    formData.append('file', data['file']['_files'][0] as File);
    formData.append('record', this.record.id.toString());

    this.http.post(`api/records/record_documents/`, formData).subscribe(
      (response: RecordDocument) => {
        this.documents = addToArray(this.documents, response) as RecordDocument[];
        this.documentData = { file: '' };
      },
      (error: HttpErrorResponse) => (this.messageErrors = error.error as DjangoError)
    );
  }

  onDownloadClick(id: number, name: string): void {
    this.http
      .get(`api/records/record_documents/${id}/`, { observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: HttpResponse<Blob>) => {
        this.downloadFile(response, name);
      });
    // this.http.get(`api/records/e_record/documents/${id}/`).subscribe((response) => StorageService.saveFile(response, name));
  }

  downloadFile(response: HttpResponse<Blob>, name: string): void {
    const filename: string = name;
    const binaryData = [];
    binaryData.push(response.body);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  onDeleteClick(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this file?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http
            .delete(`api/records/record_documents/${id}/`)
            .subscribe(() => (this.documents = removeFromArray(this.documents, id) as RecordDocument[]));
        }
      }
    );
  }
}
