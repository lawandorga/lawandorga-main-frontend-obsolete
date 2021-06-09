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
import { from, of } from 'rxjs';

import {
  START_CREATE_USER,
  StartCreateUser,
  START_PATCH_USER,
  StartPatchUser,
  SET_USER,
  SET_OTHER_USERS,
  START_LOADING_GROUPS,
  SET_GROUPS,
  START_LOADING_SPECIAL_PERMISSION,
  StartLoadingSpecialPermission,
  SET_SPECIAL_PERMISSION,
  START_LOADING_RLCS,
  SET_RLCS,
  START_REMOVING_HAS_PERMISSION,
  StartRemovingHasPermission,
  REMOVE_SINGLE_HAS_PERMISSION,
  START_ADDING_HAS_PERMISSION,
  StartAddingHasPermission,
  ADD_SINGLE_HAS_PERMISSION,
  START_LOADING_SPECIAL_GROUP_HAS_PERMISSIONS,
  StartLoadingSpecialGroupHasPermissions,
  START_LOADING_HAS_PERMISSION_STATICS,
  SET_ACTUAL_HAS_PERMISSIONS,
  START_ADDING_GROUP,
  StartAddingGroup,
  ADD_GROUP,
  START_LOADING_NEW_USER_REQUESTS,
  SET_NEW_USER_REQUESTS,
  START_ADMITTING_NEW_USER_REQUEST,
  StartAdmittingNewUserRequest,
  START_DECLINING_NEW_USER_REQUEST,
  StartDecliningNewUserRequest,
  UPDATE_NEW_USER_REQUEST,
  START_SAVING_USER,
  StartSavingUser,
  START_LOADING_INACTIVE_USERS,
  SET_INACTIVE_USERS,
  START_CHECKING_USER_HAS_PERMISSIONS,
  SET_USER_PERMISSIONS,
  START_LOADING_UNREAD_NOTIFICATIONS,
  SET_NOTIFICATIONS,
} from './core.actions';
import {
  CREATE_PROFILE_API_URL,
  GetPermissionsForGroupApiURL,
  GetSpecialHasPermissionApiURL,
  GetSpecialPermissionApiURL,
  GetSpecialProfileApiURL,
  GROUPS_API_URL,
  HAS_PERMISSION_API_URL,
  HAS_PERMISSIONS_STATICS_API_URL,
  INACTIVE_USERS_API_URL,
  GetNewUserRequestApiUrl,
  NEW_USER_REQUEST_API_URL,
  RLCS_API_URL,
  UNREAD_NOTIFICATIONS_API_URL,
  USER_HAS_PERMISSIONS_API_URL,
} from '../../statics/api_urls.statics';
import { CoreSandboxService } from '../services/core-sandbox.service';
import { FullUser, RestrictedUser } from '../models/user.model';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { RestrictedGroup } from '../models/group.model';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedRlc } from '../models/rlc.model';
import { NewUserRequest } from '../models/new_user_request.model';
import { AppSandboxService } from '../services/app-sandbox.service';
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
  startLoadingGroups = this.actions.pipe(
    ofType(START_LOADING_GROUPS),
    switchMap(() => {
      return from(
        this.http.get(GROUPS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading groups: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const groups = RestrictedGroup.getRestrictedGroupsFromJsonArray(response.results ? response.results : response);
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
  startLoadingSpecialPermission = this.actions.pipe(
    ofType(START_LOADING_SPECIAL_PERMISSION),
    map((action: StartLoadingSpecialPermission) => {
      return action.payload;
    }),
    switchMap((id: string) => {
      return from(
        this.http.get(GetSpecialPermissionApiURL(id)).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading special permission: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const permission = Permission.getPermissionFromJson(response);
            const hasPermissions = HasPermission.getPermissionsFromJsonArray(response.has_permissions);
            return [
              {
                type: SET_SPECIAL_PERMISSION,
                payload: permission,
              },
              {
                type: SET_ACTUAL_HAS_PERMISSIONS,
                payload: hasPermissions,
              },
            ];
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
  startRemovingHasPermission = this.actions.pipe(
    ofType(START_REMOVING_HAS_PERMISSION),
    map((action: StartRemovingHasPermission) => {
      return action.payload;
    }),
    switchMap((id: string) => {
      return from(
        this.http.delete(GetSpecialHasPermissionApiURL(id)).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at deleting hasPermission: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            return [
              {
                type: REMOVE_SINGLE_HAS_PERMISSION,
                payload: id,
              },
              {
                type: START_CHECKING_USER_HAS_PERMISSIONS,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startAddingHasPermission = this.actions.pipe(
    ofType(START_ADDING_HAS_PERMISSION),
    map((action: StartAddingHasPermission) => {
      return action.payload;
    }),
    switchMap((toAdd: any) => {
      const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
      return from(
        this.http.post(HAS_PERMISSION_API_URL, toAdd, privateKeyPlaceholder).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at creating hasPermission: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const hasPermission = HasPermission.getHasPermissionFromJson(response);
            return [
              {
                type: ADD_SINGLE_HAS_PERMISSION,
                payload: hasPermission,
              },
              {
                type: START_CHECKING_USER_HAS_PERMISSIONS,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingSpecialGroupHasPermissions = this.actions.pipe(
    ofType(START_LOADING_SPECIAL_GROUP_HAS_PERMISSIONS),
    map((action: StartLoadingSpecialGroupHasPermissions) => {
      return action.payload;
    }),
    switchMap((id: string) => {
      return from(
        this.http.get(GetPermissionsForGroupApiURL(id)).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading special group has permissions: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const hasPermissions: HasPermission[] = HasPermission.getPermissionsFromJsonArray(response);
            return [
              {
                type: SET_ACTUAL_HAS_PERMISSIONS,
                payload: hasPermissions,
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
            const otherUsers = RestrictedUser.getRestrictedUsersFromJsonArray(response.users);
            const groups = RestrictedGroup.getRestrictedGroupsFromJsonArray(response.groups);
            return [
              {
                type: SET_OTHER_USERS,
                payload: otherUsers,
              },
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
  startAddingGroup = this.actions.pipe(
    ofType(START_ADDING_GROUP),
    map((action: StartAddingGroup) => {
      return action.payload;
    }),
    switchMap((newGroup: { name: string; visible: boolean }) => {
      return from(
        this.http.post(GROUPS_API_URL, newGroup).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at adding new group: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const group = RestrictedGroup.getRestrictedUserFromJson(response);
            return [
              {
                type: ADD_GROUP,
                payload: group,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startLoadingNewUserRequests = this.actions.pipe(
    ofType(START_LOADING_NEW_USER_REQUESTS),
    switchMap(() => {
      return from(
        this.http.get(NEW_USER_REQUEST_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading new user requests: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const requests = NewUserRequest.getNewUserRequestFromJsonArray(response);
            return [
              {
                type: SET_NEW_USER_REQUESTS,
                payload: requests,
              },
            ];
          })
        )
      );
    })
  );

  @Effect()
  startAdmittingNewUserRequest = this.actions.pipe(
    ofType(START_ADMITTING_NEW_USER_REQUEST),
    map((action: StartAdmittingNewUserRequest) => {
      return action.payload;
    }),
    switchMap((newUserRequest: NewUserRequest) => {
      const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
      return from(
        this.http
          .put(
            GetNewUserRequestApiUrl(Number(newUserRequest.id)),
            {
              state: 'gr',
            },
            privateKeyPlaceholder
          )
          .pipe(
            catchError((error) => {
              this.snackbar.showErrorSnackBar('error at accepting new user request: ' + error.error.detail);
              return [];
            }),
            mergeMap((response: any) => {
              const request = NewUserRequest.getNewUserRequestFromJson(response);
              return [
                {
                  type: UPDATE_NEW_USER_REQUEST,
                  payload: request,
                },
              ];
            })
          )
      );
    })
  );

  @Effect()
  startDecliningNewUserRequest = this.actions.pipe(
    ofType(START_DECLINING_NEW_USER_REQUEST),
    map((action: StartDecliningNewUserRequest) => {
      return action.payload;
    }),
    switchMap((newUserRequest: NewUserRequest) => {
      return from(
        this.http
          .put(GetNewUserRequestApiUrl(Number(newUserRequest.id)), {
            id: newUserRequest.id,
            state: 'de',
          })
          .pipe(
            catchError((error) => {
              this.snackbar.showErrorSnackBar('error at accepting new user request: ' + error.error.detail);
              return [];
            }),
            mergeMap((response: any) => {
              const request = NewUserRequest.getNewUserRequestFromJson(response);
              return [
                {
                  type: UPDATE_NEW_USER_REQUEST,
                  payload: request,
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
  startLoadingInactiveUsers = this.actions.pipe(
    ofType(START_LOADING_INACTIVE_USERS),
    switchMap(() => {
      return from(
        this.http.get(INACTIVE_USERS_API_URL).pipe(
          catchError((error) => {
            this.snackbar.showErrorSnackBar('error at loading inactive users: ' + error.error.detail);
            return [];
          }),
          mergeMap((response: any) => {
            const inactive_users = FullUser.getFullUsersFromJsonArray(response);
            return [
              {
                type: SET_INACTIVE_USERS,
                payload: inactive_users,
              },
            ];
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
