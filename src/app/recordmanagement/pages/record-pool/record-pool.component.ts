import { Component, OnInit } from '@angular/core';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import axios, { DjangoError } from '../../../shared/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { NewRestrictedRecord } from '../../models/record.model';

interface Pool {
  type: string;
  entries: Array<{
    id: number;
    enlisted: string;
    consultant?: number;
    record_key?: string;
    record?: number;
    yielder?: number;
  }>;
  number_of_own_enlistings: number;
}

@Component({
  selector: 'app-record-pool',
  templateUrl: './record-pool.component.html',
})
export class RecordPoolComponent implements OnInit {
  consultants: number;
  records: number;
  users_enlistings: number;

  errors: DjangoError;
  fields = [
    {
      label: 'Record',
      tag: 'select',
      name: 'record',
      required: true,
      options: [],
    },
  ];
  pool: Pool;

  constructor(private recordSB: RecordsSandboxService, private coreSB: CoreSandboxService) {}

  ngOnInit(): void {
    axios
      .get('api/records/records/')
      .then((response: AxiosResponse<NewRestrictedRecord[]>) => {
        this.fields[0].options = response.data
          .filter((record) => record.access)
          .map((record) => ({ name: record.record_token, id: record.id }));
      })
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    this.getPool();
  }

  getPool(): void {
    axios
      .get('api/records/record_pool/')
      .then((response: AxiosResponse<Pool>) => (this.pool = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  onEnlistClick(): void {
    axios
      .post('api/records/pool_consultants/')
      .then((response: AxiosResponse<{ action: string }>) => {
        const message =
          response.data.action === 'created' ? 'You enlisted successfully into the record pool.' : "You've been given a record";
        this.coreSB.showSuccessSnackBar(message);
        this.getPool();
      })
      .catch(() => this.coreSB.showErrorSnackBar('Ooops there seems to be an error. Please write an email to it@law-orga.de!'));
  }

  onYieldRecord(data: { record: number }): void {
    axios
      .post('api/records/pool_records/', { record: data.record })
      .then(() => {
        this.coreSB.showSuccessSnackBar('Record was added to the record pool.');
        this.getPool();
      })
      .catch((error: AxiosError<DjangoError>) => (this.errors = error.response.data));
  }
}
