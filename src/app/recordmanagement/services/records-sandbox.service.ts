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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { RecordsState } from '../store/records.reducers';
import {
  AddRecordDocument,
  ResetFullClientInformation,
  SetSpecialRecordRequestState,
  StartAddingNewRecordMessage,
  StartAdmittingRecordPermissionRequest,
  StartDecliningRecordPermissionRequest,
  StartLoadingRecordDeletionRequests,
  StartLoadingRecordPermissionRequests,
  StartLoadingRecordStatics,
  StartProcessingRecordDeletionRequest,
  StartRequestingReadPermission,
  StartRequestingRecordDeletion,
  StartSettingRecordDocumentTags,
} from '../store/actions/records.actions';
import { Tag } from '../models/tag.model';
import { CoreSandboxService } from '../../core/services/core-sandbox.service';
import { RestrictedRecord } from '../models/record.model';
import { StorageService } from '../../shared/services/storage.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { RecordPermissionRequest } from '../models/record_permission.model';
import { RecordDeletionRequest } from '../models/record_deletion_request.model';
import { RecordDocument } from '../models/record_document.model';
import { PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS, RECORD_DOCUMENT_DELETIONS_API_URL } from '../../statics/api_urls.statics';
import { RecordDocumentDeletionRequest } from '../models/reocrd_document_deletion_request.model';

@Injectable({
  providedIn: 'root',
})
export class RecordsSandboxService {
  record_permission_requests: Observable<RecordPermissionRequest[]> = this.recordStore.pipe(
    select((state: any) => state.records.admin.recod_permission_requests)
  );

  constructor(
    private router: Router,
    private recordStore: Store<RecordsState>,
    private coreSB: CoreSandboxService,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private location: Location,
    private http: HttpClient
  ) {}

  startLoadingRecordStatics() {
    this.recordStore.dispatch(new StartLoadingRecordStatics());
  }

  successfullySavedRecord(response: any): void {
    this.coreSB.showSuccessSnackBar('you successfully saved the record');
    // do more
  }

  downloadRecordDocument(document: RecordDocument): void {
    this.storageService.downloadEncryptedRecordDocument(document);
  }

  showError(error_message: string): void {
    this.coreSB.showErrorSnackBar(error_message);
  }

  startLoadingRecordPermissionRequests(): void {
    this.recordStore.dispatch(new StartLoadingRecordPermissionRequests());
  }

  getRecordPermissionRequests(asArray: boolean = true): Observable<RecordPermissionRequest[] | any> {
    return this.recordStore.pipe(
      select((state: any) => {
        const values = state.records.admin.record_permission_requests;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  admitRecordPermissionRequest(request: RecordPermissionRequest): void {
    this.recordStore.dispatch(new StartAdmittingRecordPermissionRequest(request));
  }

  declineRecordPermissionRequest(request: RecordPermissionRequest): void {
    this.recordStore.dispatch(new StartDecliningRecordPermissionRequest(request));
  }

  startLoadingRecordDeletionRequests(): void {
    this.recordStore.dispatch(new StartLoadingRecordDeletionRequests());
  }

  getRecordDeletionRequests(asArray: boolean = true): Observable<RecordDeletionRequest[] | any> {
    return this.recordStore.pipe(
      select((state: any) => {
        const values = state.records.admin.record_deletion_requests;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  declineRecordDeletionRequest(request: RecordDeletionRequest): void {
    this.recordStore.dispatch(new StartProcessingRecordDeletionRequest({ request, action: 'decline' }));
  }

  admitRecordDeletionRequest(request: RecordDeletionRequest): void {
    this.recordStore.dispatch(new StartProcessingRecordDeletionRequest({ request, action: 'accept' }));
  }

  getRecordDocumentDeletionRequestsFromServer(): Promise<RecordDocumentDeletionRequest[]> {
    return this.http
      .get<any>(RECORD_DOCUMENT_DELETIONS_API_URL)
      .toPromise()
      .then((result) => {
        return RecordDocumentDeletionRequest.getRecordDocumentDeletionRequestsFromJsonArray(result);
      });
  }

  acceptRecordDocumentDeletionRequest(deletion_request: RecordDocumentDeletionRequest): Promise<any> {
    return this.http
      .post<any>(PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS, {
        request_id: deletion_request.id,
        action: 'accept',
      })
      .toPromise();
  }

  declineRecordDocumentDeletionRequest(deletion_request: RecordDocumentDeletionRequest): Promise<any> {
    return this.http
      .post<any>(PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS, {
        request_id: deletion_request.id,
        action: 'decline',
      })
      .toPromise();
  }
}
