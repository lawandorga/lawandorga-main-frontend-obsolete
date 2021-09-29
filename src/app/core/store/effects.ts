import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap } from 'rxjs';
import { Permission } from '../models/permission.model';
import { IRlc } from '../models/rlc.model';
import { IUser } from '../models/user.model';
import { AppSandboxService } from '../services/app-sandbox.service';
import {
  LoadAdminInformation,
  LOAD_ADMIN_INFORMATION,
  LoadStaticInformation,
  SetAdminInformation,
  SetAllPermissions,
  SetNotifications,
  SetRlc,
  SetUser,
  SetUserPermissions,
  START,
  LOAD_STATIC_INFORMATION,
} from './actions';

@Injectable()
export class CoreEffects {
  constructor(private actions: Actions, private http: HttpClient, private router: Router, private appSB: AppSandboxService) {}

  start = createEffect(() =>
    this.actions.pipe(
      ofType(START),
      mergeMap((payload: { token: string; privateKey: string }) => {
        return [LoadStaticInformation({ token: payload.token }), LoadAdminInformation()];
      })
    )
  );

  loadAdminInformation = createEffect(() =>
    this.actions.pipe(
      ofType(LOAD_ADMIN_INFORMATION),
      mergeMap(() =>
        this.http.get('api/profiles/admin/').pipe(
          switchMap((response: { profiles: number; record_deletion_requests: number; record_permit_requests: number }) => {
            return [SetAdminInformation(response)];
          })
        )
      )
    )
  );

  loadStaticInformation = createEffect(() =>
    this.actions.pipe(
      ofType(LOAD_STATIC_INFORMATION),
      mergeMap((payload: { token: string }) =>
        this.http.get(`api/profiles/statics/${payload.token}/`).pipe(
          switchMap((response: { user: IUser; rlc: IRlc; all_permissions: Permission[]; permissions: string[]; notifications: number }) => {
            return [
              SetUser({ payload: response.user }),
              SetRlc({ payload: response.rlc }),
              SetAllPermissions({ payload: response.all_permissions }),
              SetUserPermissions({ payload: response.permissions }),
              SetNotifications({ payload: response.notifications }),
            ];
          }),
          catchError(() => {
            return [];
          })
        )
      )
    )
  );
}
