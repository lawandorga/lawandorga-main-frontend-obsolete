import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DecrementNotificationCounter } from '../store/core.actions';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission.model';
import { RestrictedGroup } from '../models/group.model';
import { Rlc } from '../models/rlc.model';
import { HttpClient } from '@angular/common/http';
import { GetCheckUserActivationApiUrl } from '../../statics/api_urls.statics';
import { AppState } from 'src/app/app.state';
import { IUser } from '../models/user.model';

@Injectable()
export class CoreSandboxService {
  openedGuardDialogs = 0;

  constructor(
    public router: Router,
    private snackbarService: SnackbarService,
    private coreStateStore: Store<AppState>,
    private http: HttpClient
  ) {}

  getRlc(): Observable<Rlc> {
    return this.coreStateStore.select((state) => state.core.rlc);
  }

  getUserPermissions(): Observable<string[]> {
    return this.coreStateStore.select((state) => state.core.user_permissions);
  }

  getAllPermissions(): Observable<Permission[] | any> {
    return this.coreStateStore.select((state) => state.core.all_permissions);
  }

  hasPermissionFromStringForOwnRlc(permission: string, subscriberCallback): void {
    this.coreStateStore
      .select((state) => state.core.user_permissions)
      .subscribe((permissions: string[]) => {
        if (permissions.includes(permission)) {
          subscriberCallback(true);
        } else {
          subscriberCallback(false);
        }
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

  getPermissions(): Observable<string[]> {
    return this.coreStateStore.select((state) => state.core.user_permissions);
  }

  decrementNotificationCounter(): void {
    this.coreStateStore.dispatch(new DecrementNotificationCounter());
  }
}
