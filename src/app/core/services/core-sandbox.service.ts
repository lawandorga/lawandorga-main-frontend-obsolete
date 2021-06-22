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

import moment from 'moment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { CoreState } from '../store/core.reducers';
import { ForeignUser, FullUser, RestrictedUser } from '../models/user.model';
import {
  DecrementNotificationCounter,
  IncrementNotificationCounter,
  RemoveActualHasPermissions,
  ResetSpecialForeignUser,
  ResetSpecialGroup,
  ResetSpecialPermission,
  SetSpecialForeignUser,
  StartAddingHasPermission,
  StartCheckingUserHasPermissions,
  StartCreateUser,
  StartLoadingGroups,
  StartLoadingHasPermissionStatics,
  StartLoadingOtherUsers,
  StartLoadingRlcs,
  StartLoadingSpecialForeignUser,
  StartLoadingSpecialGroup,
  StartLoadingSpecialGroupHasPermissions,
  StartLoadingSpecialPermission,
  StartLoadingUnreadNotifications,
  StartRemovingHasPermission,
  StartSavingUser,
} from '../store/core.actions';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Observable } from 'rxjs';
import { HasPermission, Permission } from '../models/permission.model';
import { FullGroup, RestrictedGroup } from '../models/group.model';
import { IRlc, RestrictedRlc } from '../models/rlc.model';
import { State } from '../models/state.model';
import { HttpClient } from '@angular/common/http';
import { GetCheckUserActivationApiUrl, PROFILES_API_URL } from '../../statics/api_urls.statics';

@Injectable()
export class CoreSandboxService {
  openedGuardDialogs = 0;

  constructor(
    public router: Router,
    private snackbarService: SnackbarService,
    private coreStateStore: Store<CoreState>,
    private http: HttpClient
  ) {}

  static transformDateToString(date: Date | string): string {
    if (typeof date === 'string') return moment(new Date(date)).format('YYYY-MM-DD');
    return moment(date).format('YYYY-MM-DD');
  }

  static transformDate(date: Date | string): Date {
    if (typeof date === 'string') return new Date(moment(new Date(date)).format('YYYY-MM-DD'));
    else return new Date(moment(date).format('YYYY-MM-DD'));
  }

  getUser(): Observable<FullUser> {
    return this.coreStateStore.pipe(select((state: any) => state.core.user));
  }

  getUserRestricted(): Observable<RestrictedUser> {
    return this.coreStateStore.pipe(select((state: any) => state.core.user));
  }

  getRlc(): Observable<IRlc> {
    return this.coreStateStore.pipe(select((state: any) => state.core.rlc));
  }

  getGroup(): Observable<FullGroup> {
    return this.coreStateStore.pipe(select((state: any) => state.core.special_group));
  }

  getUserPermissions(asArray = true): Observable<HasPermission[] | any> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.user_permissions;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  getAllPermissions(): Observable<Permission[] | any> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.all_permissions;
        return Object.values(values);
      })
    );
  }

  hasPermissionFromStringForOwnRlc(permission: string, subscriberCallback): void {
    this.hasPermissionFromString(permission, subscriberCallback);
  }

  getResultsLength(): Observable<number> {
    return this.coreStateStore.pipe(select((state: any) => state.core.results_length));
  }

  hasPermissionFromString(permission: string, subscriberCallback, permission_for: any = null): void {
    /*
        checks if the user has permission and returns to subscriberCallback true or false
         */
    this.getAllPermissions().subscribe((all_permissions: Permission[]) => {
      if (all_permissions.length > 0) {
        try {
          const id = Number(all_permissions.filter((single_permission) => single_permission.name === permission)[0].id);
          this.hasPermissionFromId(id, subscriberCallback, permission_for);
        } catch (e) {
          subscriberCallback(false);
        }
      }
    });
  }

  hasPermissionFromId(permission: number, subscriberCallback, permission_for: any = null): void {
    /*
        checks if the user has permission and returns to subscriberCallback true or false
         */
    this.getUserPermissions().subscribe((user_permissions: HasPermission[]) => {
      subscriberCallback(HasPermission.checkPermissionMet(user_permissions, permission, permission_for));
    });
  }

  startSavingUser(user: FullUser) {
    this.coreStateStore.dispatch(new StartSavingUser(user));
  }

  registerUser(user: any) {
    this.coreStateStore.dispatch(new StartCreateUser(user));
  }

  getAllRlcs(asArray = true): Observable<RestrictedRlc[]> {
    //return this.http.get(RLCS_API_URL);
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.rlcs;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  startLoadingOtherUsers() {
    this.coreStateStore.dispatch(new StartLoadingOtherUsers());
  }

  startLoadingGroups() {
    this.coreStateStore.dispatch(new StartLoadingGroups());
  }

  getGroups(asArray = true): Observable<RestrictedGroup[]> | any {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.groups;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  getOtherUsers(asArray = true): Observable<RestrictedUser[] | any> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.other_users;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  showSuccessSnackBar(message: string, duration = 10000) {
    this.snackbarService.showSuccessSnackBar(message, duration);
  }

  showErrorSnackBar(message: string, duration = 10000) {
    this.snackbarService.showErrorSnackBar(message, duration);
  }

  relogUser() {
    this.router.navigate(['login']);
  }

  setForeignUser(foreignUser: ForeignUser) {
    this.coreStateStore.dispatch(new SetSpecialForeignUser(foreignUser));
  }

  resetForeignUser() {
    this.coreStateStore.dispatch(new ResetSpecialForeignUser());
  }

  getSpecialForeignUser(): Observable<ForeignUser | any> {
    return this.coreStateStore.pipe(select((state: any) => state.core.foreign_user));
  }

  loadAndGetSpecialForeignUser(id: string): Observable<ForeignUser | any> {
    this.coreStateStore.dispatch(new StartLoadingSpecialForeignUser(id));
    return this.getSpecialForeignUser();
  }

  startLoadingSpecialGroup(id: string): void {
    this.coreStateStore.dispatch(new StartLoadingSpecialGroup(id));
  }

  startLoadingRlcs(): void {
    return this.coreStateStore.dispatch(new StartLoadingRlcs());
  }

  startLoadingPermissionStatics(): void {
    this.coreStateStore.dispatch(new StartLoadingHasPermissionStatics());
  }

  startCheckingUserActivationLink(userId: number, token: string): void {
    this.http.get(GetCheckUserActivationApiUrl(userId, token)).subscribe(
      (result) => {
        this.snackbarService.showSuccessSnackBar('Your email was confirmed.');
      },
      (error) => {
        if (error.status === 400) {
          this.snackbarService.showErrorSnackBar(error.error.message);
        } else {
          this.snackbarService.showErrorSnackBar('Your activation link is invalid.');
        }
      }
    );
  }

  getUserStates(asArray = true): Observable<State[]> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.user_states;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  getUserRecordStates(asArray = true): Observable<State[]> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.user_record_states;
        return asArray ? Object.values(values) : values;
      })
    );
  }

  getUserStateByAbbreviation(abb: string): Observable<State> {
    return this.coreStateStore.pipe(select((state: any) => state.core.user_states[abb]));
  }

  getUserRecordStateByAbbreviation(abb: string): Observable<State> {
    return this.coreStateStore.pipe(select((state: any) => state.core.user_record_states[abb]));
  }

  startCheckingUserHasPermissions(): void {
    this.coreStateStore.dispatch(new StartCheckingUserHasPermissions());
  }

  startLoadingUnreadNotifications(): void {
    this.coreStateStore.dispatch(new StartLoadingUnreadNotifications());
  }

  getNotifications(): Observable<number> {
    return this.coreStateStore.pipe(
      select((state: any) => {
        return state.core.notifications;
      })
    );
  }

  decrementNotificationCounter(): void {
    this.coreStateStore.dispatch(new DecrementNotificationCounter());
  }

  incrementNotificationCounter(): void {
    this.coreStateStore.dispatch(new IncrementNotificationCounter());
  }

  getOtherUserDirect(): Observable<any> {
    // this.http.get(PROFILES_API_URL).subscribe(
    //     catchError(error => {
    //         this.showErrorSnackBar(
    //             'error at loading profiles: ' + error.error.detail
    //         );
    //         return [];
    //     }),
    //     mergeMap((response: any) => {
    //         const users = FullUser.getFullUsersFromJsonArray(
    //             response.results ? response.results : response
    //         );
    //
    //     })
    // )
    return this.http.get(PROFILES_API_URL);
  }
}
