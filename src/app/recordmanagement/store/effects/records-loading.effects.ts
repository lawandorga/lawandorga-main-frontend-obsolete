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
import { from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { START_LOADING_RECORD_DELETION_REQUESTS, START_LOADING_RECORD_PERMISSION_REQUESTS } from '../actions/records-start.actions';
import { RECORD_PERMISSIONS_LIST_API_URL, RECORD_DELETIONS_API_URL } from '../../../statics/api_urls.statics';
import { SET_RECORD_DELETION_REQUESTS, SET_RECORD_PERMISSION_REQUESTS } from '../actions/records-set.actions';
import { RecordPermissionRequest } from '../../models/record_permission.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { RecordDeletionRequest } from '../../models/record_deletion_request.model';

@Injectable()
export class RecordsLoadingEffects {
  constructor(private actions: Actions, private http: HttpClient, private snackbarService: SnackbarService) {}

  @Effect()
  startLoadingRecordPermissionRequests = this.actions.pipe(
    ofType(START_LOADING_RECORD_PERMISSION_REQUESTS),
    switchMap(() => {
      return from(
        this.http.get(RECORD_PERMISSIONS_LIST_API_URL).pipe(
          catchError((error) => {
            this.snackbarService.showErrorSnackBar(`error at loading record permission list: ${error.error.detail}`);
            return [];
          }),
          mergeMap((response) => {
            return [
              {
                type: SET_RECORD_PERMISSION_REQUESTS,
                payload: RecordPermissionRequest.getRecordPermissionRequestsFromJsonArray(response),
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingRecordDeletionRequests = this.actions.pipe(
    ofType(START_LOADING_RECORD_DELETION_REQUESTS),
    switchMap(() => {
      return from(
        this.http.get(RECORD_DELETIONS_API_URL).pipe(
          catchError((error) => {
            this.snackbarService.showErrorSnackBar(`error at loading record deletion list: ${error.error.detail}`);
            return [];
          }),
          mergeMap((response) => {
            return [
              {
                type: SET_RECORD_DELETION_REQUESTS,
                payload: RecordDeletionRequest.getRecordDeletionRequestsFromJsonArray(response),
              },
            ];
          })
        )
      );
    })
  );
}
