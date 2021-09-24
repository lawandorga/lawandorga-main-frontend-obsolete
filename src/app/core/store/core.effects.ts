import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

import {
  START_CHECKING_USER_HAS_PERMISSIONS,
  SET_USER_PERMISSIONS,
  START_LOADING_UNREAD_NOTIFICATIONS,
  SET_NOTIFICATIONS,
} from './core.actions';
import { UNREAD_NOTIFICATIONS_API_URL, USER_HAS_PERMISSIONS_API_URL } from '../../statics/api_urls.statics';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { HasPermission } from '../models/permission.model';

@Injectable()
export class CoreEffects {
  constructor(private actions: Actions, private http: HttpClient, private snackbar: SnackbarService) {}

  @Effect()
  startCheckingUserHasPermissions = this.actions.pipe(
    ofType(START_CHECKING_USER_HAS_PERMISSIONS),
    switchMap(() => {
      return from(
        this.http.get(USER_HAS_PERMISSIONS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at checking user permissions: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const user_permissions = HasPermission.getPermissionsFromJsonArray(response.user_permissions);
            return [
              {
                type: SET_USER_PERMISSIONS,
                payload: user_permissions,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingUnreadNotifications = this.actions.pipe(
    ofType(START_LOADING_UNREAD_NOTIFICATIONS),
    switchMap(() => {
      return from(
        this.http.get(UNREAD_NOTIFICATIONS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at getting unread notifications: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: { unread_notifications }) => {
            return [
              {
                type: SET_NOTIFICATIONS,
                payload: response.unread_notifications,
              },
            ];
          })
        )
      );
    })
  );
}
