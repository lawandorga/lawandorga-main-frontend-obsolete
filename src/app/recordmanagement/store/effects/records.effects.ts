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
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

import {
  START_ADMITTING_RECORD_PERMISSION_REQUEST,
  START_DECLINING_RECORD_PERMISSION_REQUEST,
  START_ENLISTING_POOL_CONSULTANT,
  START_LOADING_RECORD_POOL,
  START_LOADING_SPECIAL_RECORD,
  START_PROCESSING_RECORD_DELETION_REQUEST,
  START_REQUESTING_RECORD_DELETION,
  START_REQUESTING_RECORD_PERMISSION,
  START_SAVING_RECORD,
  START_SETTING_RECORD_DOCUMENT_TAGS,
  START_YIELDING_RECORD,
  StartAdmittingRecordPermissionRequest,
  StartDecliningRecordPermissionRequest,
  StartProcessingRecordDeletionRequest,
  StartRequestingReadPermission,
  StartRequestingRecordDeletion,
  StartSavingRecord,
  StartSettingRecordDocumentTags,
  StartYieldingRecord,
  UPDATE_RECORD_DELETION_REQUEST,
  UPDATE_RECORD_PERMISSION_REQUEST,
} from '../actions/records.actions';
import {
  GetRecordDocumentApiUrl,
  GetRecordPermissionRequestApiUrl,
  GetSpecialRecordApiURL,
  POOL_CONSULTANT_API_URL,
  POOL_RECORD_API_URL,
  PROCESS_RECORD_DELETIONS_API_URL,
  RECORD_DELETIONS_API_URL,
  RECORD_PERMISSIONS_LIST_API_URL,
} from '../../../statics/api_urls.statics';
import { FullRecord, RestrictedRecord } from '../../models/record.model';
import { Tag } from '../../models/tag.model';
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
  startSavingRecord = this.actions.pipe(
    ofType(START_SAVING_RECORD),
    map((action: StartSavingRecord) => {
      return action.payload;
    }),
    switchMap((payload: { data: any; id: string }) => {
      const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();

      return from(
        this.http.patch(GetSpecialRecordApiURL(payload.id), payload.data, privateKeyPlaceholder).pipe(
          catchError((error) => {
            this.recordSB.showError(`error at saving records: ${error.error.detail}`);
            return [];
          }),
          mergeMap((response: any) => {
            this.recordSB.successfullySavedRecord(response);
            return [{ type: START_LOADING_SPECIAL_RECORD, payload: payload.id }];
          })
        )
      );
    })
  );

  @Effect()
  startSettingRecordDocumentTags = this.actions.pipe(
    ofType(START_SETTING_RECORD_DOCUMENT_TAGS),
    map((action: StartSettingRecordDocumentTags) => {
      return action.payload;
    }),
    mergeMap((payload: { tags: Tag[]; document_id: string }) => {
      return from(
        this.http
          .post(GetRecordDocumentApiUrl(payload.document_id), {
            tag_ids: payload.tags,
          })
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at loading records: ${error.error.detail}`);
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

  @Effect()
  startYieldingRecord = this.actions.pipe(
    ofType(START_YIELDING_RECORD),
    map((action: StartYieldingRecord) => {
      return action.payload;
    }),
    mergeMap((payload: FullRecord) => {
      const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
      return from(
        this.http
          .post(
            POOL_RECORD_API_URL,
            {
              record: payload.id,
            },
            privateKeyPlaceholder
          )
          .pipe(
            catchError((error) => {
              this.recordSB.showError(`error at yielding record: ${error.error.detail}`);
              return [];
            }),
            mergeMap((response: { error }) => {
              if (response.error) {
                this.recordSB.showError('sending error');
                return [];
              }
              if (response['action'] === 'created') {
                this.coreSB.showSuccessSnackBar('record added to record pool');
              } else if (response['action'] === 'matched') {
                this.coreSB.showSuccessSnackBar('record matched with consultant from pool, you are no longer responsible for this record');
              }
              return [{ type: START_LOADING_RECORD_POOL }];
            })
          )
      );
    })
  );

  @Effect()
  startEnlistingPoolConsultant = this.actions.pipe(
    ofType(START_ENLISTING_POOL_CONSULTANT),
    switchMap(() => {
      return from(
        this.http.post(POOL_CONSULTANT_API_URL, {}).pipe(
          catchError((error) => {
            this.recordSB.showError(`error at enlisting to consultant pool: ${error.error.detail}`);
            return [];
          }),
          mergeMap((response) => {
            if (response.error) {
              this.recordSB.showError('sending error');
              return [];
            }
            if (response['action'] === 'created') {
              this.coreSB.showSuccessSnackBar(
                `you enlisted successfully to consultant pool. You are enlisted ${response.number_of_enlistings} times`
              );
            } else if (response['action'] === 'matched') {
              this.coreSB.showSuccessSnackBar('you matched successfully, you are now responsible for another record');
            }
            return [{ type: START_LOADING_RECORD_POOL }];
          })
        )
      );
    })
  );
}
