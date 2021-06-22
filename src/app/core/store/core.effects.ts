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
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

import {
  START_CREATE_USER,
  StartCreateUser,
  SET_GROUPS,
  START_LOADING_RLCS,
  SET_RLCS,
  START_LOADING_HAS_PERMISSION_STATICS,
  SET_ACTUAL_HAS_PERMISSIONS,
  START_SAVING_USER,
  StartSavingUser,
  START_CHECKING_USER_HAS_PERMISSIONS,
  SET_USER_PERMISSIONS,
  START_LOADING_UNREAD_NOTIFICATIONS,
  SET_NOTIFICATIONS,
} from './core.actions';
import {
  CREATE_PROFILE_API_URL,
  GetSpecialProfileApiURL,
  HAS_PERMISSIONS_STATICS_API_URL,
  RLCS_API_URL,
  UNREAD_NOTIFICATIONS_API_URL,
  USER_HAS_PERMISSIONS_API_URL,
} from '../../statics/api_urls.statics';
import { CoreSandboxService } from '../services/core-sandbox.service';
import { FullUser } from '../models/user.model';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { RestrictedGroup } from '../models/group.model';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedRlc } from '../models/rlc.model';
import { Router } from '@angular/router';

@Injectable()
export class CoreEffects {
  constructor(
    private actions: Actions,
    private http: HttpClient,
    private coreSB: CoreSandboxService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  @Effect()
  startCreateUser = this.actions.pipe(
    ofType(START_CREATE_USER),
    map((action: StartCreateUser) => {
      return action.payload;
    }),
    switchMap((user: any) => {
      return from(
        this.http.post(CREATE_PROFILE_API_URL, user).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at register: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            if (!response.error) {
              this.coreSB.showSuccessSnackBar('successfully created account');
              this.coreSB.router.navigate(['login']);
            }
            return [];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingRlcs = this.actions.pipe(
    ofType(START_LOADING_RLCS),
    switchMap(() => {
      return from(
        this.http.get(RLCS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading rlcs: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const rlcs = RestrictedRlc.getRestrictedRlcsFromJsonArray(response);
            if (rlcs.length === 0) {
              this.snackbar.showErrorSnackBar('unfortunately there are no rlcs until now');
            }
            return [
              {
                type: SET_RLCS,
                payload: rlcs,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingHasPermissionStatics = this.actions.pipe(
    ofType(START_LOADING_HAS_PERMISSION_STATICS),
    switchMap(() => {
      return from(
        this.http.get(HAS_PERMISSIONS_STATICS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading hasPermission statics: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const groups = RestrictedGroup.getRestrictedGroupsFromJsonArray(response.groups);
            return [
              {
                type: SET_GROUPS,
                payload: groups,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startSavingUser = this.actions.pipe(
    ofType(START_SAVING_USER),
    map((action: StartSavingUser) => {
      return action.payload;
    }),
    switchMap((user: FullUser) => {
      return from(
        this.http.patch(GetSpecialProfileApiURL(user.id), user).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at saving user: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            this.snackbar.showSuccessSnackBar('successfully saved profile');
            return [];
          })
        )
      );
    })
  );

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
