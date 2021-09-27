import { Component, OnInit } from '@angular/core';
import { replaceInArray } from '../../../shared/services/axios';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-records-deletion-requests',
  templateUrl: './records-deletion-requests.component.html',
})
export class RecordsDeletionRequestsComponent implements OnInit {
  constructor(private http: HttpClient) {}

  requestsDisplayedColumns = ['requestor', 'record', 'date', 'state', 'processor', 'processDate', 'action'];
  deletionRequests: RecordDeletionRequest[];

  ngOnInit(): void {
    this.http
      .get('api/records/record_deletion_requests/')
      .subscribe((response: RecordDeletionRequest[]) => (this.deletionRequests = response));
  }

  getRequestState(state: string): string {
    switch (state) {
      case 'gr':
        return 'Granted';
      case 're':
        return 'Requested';
      case 'de':
        return 'Declined';
      default:
        return 'Unknown';
    }
  }

  getRequestStateColor(state: string): string {
    switch (state) {
      case 'gr':
        return 'darkgreen';
      case 're':
        return '';
      case 'de':
        return 'darkorange';
      default:
        return 'red';
    }
  }

  onDeletionRequestAction(id: number, action: string): void {
    const data = {
      action: action,
      request_id: id,
    };
    this.http
      .post('api/records/process_record_deletion_request/', data)
      .subscribe(
        (response: RecordDeletionRequest) =>
          (this.deletionRequests = replaceInArray(this.deletionRequests, response) as RecordDeletionRequest[])
      );
  }
}
