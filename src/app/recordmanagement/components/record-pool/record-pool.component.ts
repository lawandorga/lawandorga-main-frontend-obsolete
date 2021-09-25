import { Component, OnInit } from '@angular/core';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { DjangoError } from '../../../shared/services/axios';
import { NewRestrictedRecord } from '../../models/record.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

  constructor(private coreSB: CoreSandboxService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('api/records/records/').subscribe((response: NewRestrictedRecord[]) => {
      this.fields[0].options = response.filter((record) => record.access).map((record) => ({ name: record.record_token, id: record.id }));
    });

    this.getPool();
  }

  getPool(): void {
    this.http.get('api/records/record_pool/').subscribe((response: Pool) => (this.pool = response));
  }

  onEnlistClick(): void {
    this.http.post('api/records/pool_consultants/', {}).subscribe((response: { action: string }) => {
      const message = response.action === 'created' ? 'You enlisted successfully into the record pool.' : "You've been given a record";
      this.coreSB.showSuccessSnackBar(message);
      this.getPool();
    });
  }

  onYieldRecord(data: { record: number }): void {
    this.http.post('api/records/pool_records/', { record: data.record }).subscribe(
      () => {
        this.coreSB.showSuccessSnackBar('Record was added to the record pool.');
        this.getPool();
      },
      (error: HttpErrorResponse) => (this.errors = error.error as DjangoError)
    );
  }
}
