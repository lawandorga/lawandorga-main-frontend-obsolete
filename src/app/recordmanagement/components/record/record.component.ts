import { Component, OnInit } from '@angular/core';
import { FullRecord } from '../../models/record.model';
import { ActivatedRoute, Params } from '@angular/router';
import { FullClient } from '../../models/client.model';
import { addToArray, DjangoError, removeFromArray, SubmitData } from 'src/app/shared/services/axios';
import { AppSandboxService } from 'src/app/core/services/app-sandbox.service';
import { OriginCountry } from '../../models/country.model';
import { RestrictedUser } from 'src/app/core/models/user.model';
import { Message } from '../../models/message.model';
import { RecordDocument } from '../../models/record_document.model';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import downloadFile from 'src/app/shared/other/download';
import { Tag } from '../../models/tag.model';

interface Field {
  label: string;
  type?: string;
  tag: string;
  name: string;
  required: boolean;
  options?: { id: string; name: string }[] | { id: number; name: string }[] | [];
}

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
})
export class RecordComponent implements OnInit {
  id: string;

  record: FullRecord;
  recordErrors: DjangoError;
  recordFields: Field[] = [
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
      label: 'Tags',
      tag: 'select-multiple',
      name: 'tags',
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
    private appSB: AppSandboxService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] as string;
    });

    this.http.get('api/records/consultants/').subscribe((response: RestrictedUser[]) => (this.recordFields[5].options = response));

    this.http.get('api/records/tags/').subscribe((response: Tag[]) => (this.recordFields[6].options = response));

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
        this.appSB.showSuccessSnackBar('Client saved successfully.');
      },
      (error: HttpErrorResponse) => (this.clientErrors = error.error as DjangoError)
    );
  }

  onRecordSend(data: SubmitData): void {
    void this.http.patch(`api/records/records/${this.record.id}/`, data).subscribe(
      (response: FullRecord) => {
        this.record = response;
        this.appSB.showSuccessSnackBar('Record saved successfully.');
      },
      (error: HttpErrorResponse) => (this.recordErrors = error.error as DjangoError)
    );
  }

  onMessageSend(data: SubmitData): void {
    void this.http.post(`api/records/records/${this.record.id}/add_message/`, data).subscribe(
      (response: Message) => {
        this.messages = addToArray(this.messages, response) as Message[];
        this.messageData = { message: '' };
        this.appSB.showSuccessSnackBar('Message saved successfully.');
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
      .get(`api/records/record_documents/${id}/`, { observe: 'response', responseType: 'blob' })
      .subscribe((response: HttpResponse<Blob>) => {
        downloadFile(response, name);
      });
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
