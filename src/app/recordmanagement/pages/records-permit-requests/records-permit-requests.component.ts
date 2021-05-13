import { Component, OnInit } from '@angular/core';
import { RecordPermissionRequest } from '../../models/record_permission.model';
import axios, { DjangoError, replaceInArray } from '../../../shared/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { CoreSandboxService } from 'src/app/core/services/core-sandbox.service';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';

@Component({
  selector: 'app-records-permit-requests',
  templateUrl: './records-permit-requests.component.html',
})
export class RecordsPermitRequestsComponent implements OnInit {
  constructor(private coreSB: CoreSandboxService) {}

  requestsDisplayedColumns = ['requestor', 'record', 'date', 'state', 'processor', 'processDate', 'action'];
  requests: RecordPermissionRequest[];
  deletionRequests: RecordDeletionRequest[];

  ngOnInit(): void {
    axios
      .get('api/records/e_record_permission_requests/')
      .then((response: AxiosResponse<RecordPermissionRequest[]>) => (this.requests = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

    axios
      .get('api/records/record_deletion_requests/')
      .then((response: AxiosResponse<RecordDeletionRequest[]>) => (this.deletionRequests = response.data))
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
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
      action: action,
      id: id,
    };
    axios
      .post('api/records/e_record_permission_requests/', data)
      .then(
        (response: AxiosResponse<RecordPermissionRequest>) =>
          (this.requests = replaceInArray(this.requests, response.data) as RecordPermissionRequest[])
      )
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  onDeletionRequestAction(id: number, action: string): void {
    const data = {
      action: action,
      request_id: id,
    };
    axios
      .post('api/records/record_deletion_requests/', data)
      .then(
        (response: AxiosResponse<RecordDeletionRequest>) =>
          (this.deletionRequests = replaceInArray(this.deletionRequests, response.data) as RecordDeletionRequest[])
      )
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }
}
