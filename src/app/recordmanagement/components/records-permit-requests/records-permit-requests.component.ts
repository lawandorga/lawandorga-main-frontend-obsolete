import { Component, OnInit } from '@angular/core';
import { RecordPermissionRequest } from '../../models/record_permission.model';
import { replaceInArray } from '../../../shared/services/axios';
import { AppSandboxService } from 'src/app/core/services/app-sandbox.service';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-records-permit-requests',
  templateUrl: './records-permit-requests.component.html',
})
export class RecordsPermitRequestsComponent implements OnInit {
  constructor(private appSB: AppSandboxService, private http: HttpClient) {}

  requestsDisplayedColumns = ['requestor', 'record', 'date', 'state', 'processor', 'processDate', 'action'];
  requests: RecordPermissionRequest[];
  deletionRequests: RecordDeletionRequest[];

  ngOnInit(): void {
    this.http.get('api/records/record_permission_requests/').subscribe((response: RecordPermissionRequest[]) => (this.requests = response));

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

  onRequestAction(id: number, action: string): void {
    const data = {
      state: action,
    };
    this.http
      .patch(`api/records/record_permission_requests/${id}/`, data)
      .subscribe(
        (response: RecordPermissionRequest) => (this.requests = replaceInArray(this.requests, response) as RecordPermissionRequest[])
      );
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
