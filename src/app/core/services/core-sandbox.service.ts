import moment from 'moment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DecrementNotificationCounter } from '../store/core.actions';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Observable } from 'rxjs';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedGroup } from '../models/group.model';
import { Rlc } from '../models/rlc.model';
import { HttpClient } from '@angular/common/http';
import { GetCheckUserActivationApiUrl } from '../../statics/api_urls.statics';
import { AppState } from 'src/app/app.state';
import { IUser } from '../models/user.model';
import { selectRemainingMinutes } from '../store/auth/selectors';

@Injectable()
export class CoreSandboxService {
  openedGuardDialogs = 0;

  constructor(
    public router: Router,
    private snackbarService: SnackbarService,
    private coreStateStore: Store<AppState>,
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

  getRlc(): Observable<Rlc> {
    return this.coreStateStore.select((state) => state.core.rlc);
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

  getGroups(asArray = true): Observable<RestrictedGroup[]> | any {
    return this.coreStateStore.pipe(
      select((state: any) => {
        const values = state.core.groups;
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

  getNotifications(): Observable<number> {
    return this.coreStateStore.select((state) => state.core.notifications);
  }

  getUser(): Observable<IUser> {
    return this.coreStateStore.select((state) => state.core.user);
  }

  getPermissions(): Observable<HasPermission[]> {
    return this.coreStateStore.select((state) => state.core.user_permissions);
  }

  getTimeRemaining(): Observable<number> {
    return this.coreStateStore.select(selectRemainingMinutes);
  }

  decrementNotificationCounter(): void {
    this.coreStateStore.dispatch(new DecrementNotificationCounter());
  }
}
