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
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  START_ADMITTING_RECORD_PERMISSION_REQUEST,
  START_DECLINING_RECORD_PERMISSION_REQUEST,
  START_PROCESSING_RECORD_DELETION_REQUEST,
  START_REQUESTING_RECORD_DELETION,
  START_REQUESTING_RECORD_PERMISSION,
  StartAdmittingRecordPermissionRequest,
  StartDecliningRecordPermissionRequest,
  StartProcessingRecordDeletionRequest,
  StartRequestingReadPermission,
  StartRequestingRecordDeletion,
  UPDATE_RECORD_DELETION_REQUEST,
  UPDATE_RECORD_PERMISSION_REQUEST,
} from '../actions/records.actions';
import {
  GetRecordPermissionRequestApiUrl,
  PROCESS_RECORD_DELETIONS_API_URL,
  RECORD_DELETIONS_API_URL,
  RECORD_PERMISSIONS_LIST_API_URL,
} from '../../../statics/api_urls.statics';
import { RestrictedRecord } from '../../models/record.model';
import { AppSandboxService } from '../../../core/services/app-sandbox.service';
import { RecordsSandboxService } from '../../services/records-sandbox.service';
import { RecordPermissionRequest } from '../../models/record_permission.model';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';

@Injectable()
export class RecordsEffects {
  constructor(
    private actions: Actions,
    private http: HttpClient,
    private recordSB: RecordsSandboxService,
    private appSB: AppSandboxService,
    private coreSB: CoreSandboxService
  ) {}

  @Effect()
  startRequestingRecordPermission = this.actions.pipe(
    ofType(START_REQUESTING_RECORD_PERMISSION),
    map((action: StartRequestingReadPermission) => {
      return action.payload;
    }),
    mergeMap((record: RestrictedRecord) => {
      return from(
        this.http.post(GetRecordPermissionRequestApiUrl(record.id.toString()), {}).pipe(
          catchError((error) => {
            this.recordSB.showError(`error at requesting record permission: ${error.error.detail}`);
            return [];
          }),
          mergeMap((response: { error }) => {
            if (response.error) {
              this.recordSB.showError('sending error');
              return [];
            }
            return [];
          })
        )
      );
    })
  );

  @Effect()
  startAdmittingRecordPermissionRequest = this.actions.pipe(
    ofType(START_ADMITTING_RECORD_PERMISSION_REQUEST),
    map((action: StartAdmittingRecordPermissionRequest) => {
      return action.payload;
    }),
    mergeMap((request: RecordPermissionRequest) => {
      const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
      return from(
        this.http
          .post(
            RECORD_PERMISSIONS_LIST_API_URL,
            {
              id: request.id,
              action: 'accept',
            },
            privateKeyPlaceholder
          )
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at admitting record permission request: ${error.error.detail}`);
              return [];
            }),
            mergeMap((response: { error }) => {
              const changedRequest = RecordPermissionRequest.getRecordPermissionRequestFromJson(response);
              return [
                {
                  type: UPDATE_RECORD_PERMISSION_REQUEST,
                  payload: changedRequest,
                },
              ];
            })
          )
      );
    })
  );

  @Effect()
  startDecliningRecordPermissionRequest = this.actions.pipe(
    ofType(START_DECLINING_RECORD_PERMISSION_REQUEST),
    map((action: StartDecliningRecordPermissionRequest) => {
      return action.payload;
    }),
    mergeMap((request: RecordPermissionRequest) => {
      return from(
        this.http
          .post(RECORD_PERMISSIONS_LIST_API_URL, {
            id: request.id,
            action: 'decline',
          })
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at declining record permission request: ${error.error.detail}`);
              return [];
            }),
            mergeMap((response: { error }) => {
              const changedRequest = RecordPermissionRequest.getRecordPermissionRequestFromJson(response);
              return [
                {
                  type: UPDATE_RECORD_PERMISSION_REQUEST,
                  payload: changedRequest,
                },
              ];
            })
          )
      );
    })
  );

  @Effect()
  startRequestingRecordDeletion = this.actions.pipe(
    ofType(START_REQUESTING_RECORD_DELETION),
    map((action: StartRequestingRecordDeletion) => {
      return action.payload;
    }),
    mergeMap((payload: { record: RestrictedRecord; explanation: string }) => {
      return from(
        this.http
          .post(RECORD_DELETIONS_API_URL, {
            record_id: payload.record.id,
            explanation: payload.explanation,
          })
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at requesting record deletion: ${error.error.detail}`);
              return [];
            }),
            mergeMap((response: { error }) => {
              if (response.error) {
                this.recordSB.showError('sending error');
                return [];
              }
              return [];
            })
          )
      );
    })
  );

  @Effect()
  startProcessingRecordDeletionRequest = this.actions.pipe(
    ofType(START_PROCESSING_RECORD_DELETION_REQUEST),
    map((action: StartProcessingRecordDeletionRequest) => {
      return action.payload;
    }),
    mergeMap((payload: { request: RecordDeletionRequest; action: string }) => {
      if (payload.action !== 'accept' && payload.action !== 'decline') {
        return [];
      }

      return from(
        this.http
          .post(PROCESS_RECORD_DELETIONS_API_URL, {
            request_id: payload.request.id,
            action: payload.action,
          })
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at processing record deletion: ${error.error.detail}`);
              return [];
            }),
            mergeMap((response: { error }) => {
              if (response.error) {
                this.recordSB.showError('sending error');
                return [];
              }
              const changedRequest = RecordDeletionRequest.getRecordDeletionRequestFromJson(response);
              return [
                {
                  type: UPDATE_RECORD_DELETION_REQUEST,
                  payload: changedRequest,
                },
              ];
            })
          )
      );
    })
  );
}
