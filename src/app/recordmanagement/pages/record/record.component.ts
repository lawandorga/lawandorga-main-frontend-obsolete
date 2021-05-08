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
import axios, { addToArray, DjangoError, removeFromArray, SubmitData } from 'src/app/shared/services/axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { AxiosError, AxiosResponse } from 'axios';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from 'src/app/core/models/user.model';
import { Message } from '../../models/message.model';
import { RecordDocument } from '../../models/record_document.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
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

  messageFields = [
    {
      label: 'Message',
      type: 'text',
      tag: 'input',
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

  constructor(private sharedSB: SharedSandboxService, private route: ActivatedRoute, private coreSB: CoreSandboxService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] as string;
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

    this.getRecord(this.id);

    this.getMessages(this.id);

    this.getDocuments(this.id);
  }

  getMessages(id: string | number): void {
    axios
      .get(`api/records/records/${id}/messages/`)
      .then((response: AxiosResponse<Message[]>) => (this.messages = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  getDocuments(id: string | number): void {
    axios
      .get(`api/records/records/${id}/documents/`)
      .then((response: AxiosResponse<RecordDocument[]>) => (this.documents = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  getRecord(id: string | number): void {
    axios
      .get(`api/records/records/${id}/`)
      .then((response: AxiosResponse<FullRecord>) => {
        this.record = response.data;
        this.getClient(response.data.client);
      })
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  getClient(id: number): void {
    void axios
      .get(`api/records/e_clients/${id}/`)
      .then((response: AxiosResponse<FullClient>) => (this.client = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  onClientSend(data: SubmitData): void {
    void axios
      .patch(`api/records/e_clients/${this.client.id}/`, data)
      .then((response: AxiosResponse<FullClient>) => {
        this.client = response.data;
      })
      .catch((error: AxiosError<DjangoError>) => (this.clientErrors = error.response.data));
  }

  onRecordSend(data: SubmitData): void {
    void axios
      .patch(`api/records/records/${this.record.id}/`, data)
      .then((response: AxiosResponse<FullRecord>) => {
        this.record = response.data;
      })
      .catch((error: AxiosError<DjangoError>) => (this.recordErrors = error.response.data));
  }

  onMessageSend(data: SubmitData): void {
    console.log(data);

    void axios
      .post(`api/records/records/${this.record.id}/add_message/`, data)
      .then((response: AxiosResponse<Message>) => {
        this.messages = addToArray(this.messages, response.data) as Message[];
        this.messageData = { message: '' };
      })
      .catch((error: AxiosError<DjangoError>) => (this.messageErrors = error.response.data));
  }

  onDocumentSend(data: SubmitData): void {
    const formData = new FormData();
    // eslint-disable-next-line
    formData.append('files', data['file']['_files'][0] as File);

    void axios
      .post(`api/records/e_record/${this.record.id}/documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response: AxiosResponse<RecordDocument[]>) => {
        this.documents = addToArray(this.documents, response.data[0]) as RecordDocument[];
        this.documentData = { file: '' };
      })
      .catch((error: AxiosError<DjangoError>) => (this.messageErrors = error.response.data));
  }

  onDownloadClick(id: number, name: string): void {
    axios
      .get(`api/records/e_record/documents/${id}/`)
      .then((response: AxiosResponse<FullClient>) => StorageService.saveFile(response.data, name))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
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
          axios
            .delete(`api/records/record_documents/${id}/`)
            .then(() => (this.documents = removeFromArray(this.documents, id) as RecordDocument[]))
            .catch((err: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(err.response.data.detail));
        }
      }
    );
  }
}
