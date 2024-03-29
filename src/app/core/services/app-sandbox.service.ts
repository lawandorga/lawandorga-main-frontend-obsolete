import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ForgotPassword, ResetPassword, SetUsersPrivateKey, SetToken } from 'src/app/auth/store/actions';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission.model';
import { IRlc } from '../models/rlc.model';
import { AppState } from 'src/app/app.state';
import { IUser } from '../models/user.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Start } from '../store/actions';
import { AdminInformation } from '../store/reducers';
import { selectAdminNotifications } from '../store/selectors';

@Injectable()
export class AppSandboxService {
  constructor(private store: Store<AppState>, private router: Router, private media: MediaMatcher, private snackBar: MatSnackBar) {}

  isAuthenticated(): boolean {
    let isAuthenticated = false;
    this.getAuthenticated().subscribe((authenticated) => (isAuthenticated = authenticated));
    return isAuthenticated;
  }

  startApp(): void {
    const loginInformation = this.loadTokenAndUsersPrivateKey();
    if (loginInformation.token !== null && loginInformation.token !== '') {
      this.store.dispatch(SetToken({ token: loginInformation.token }));
      this.store.dispatch(SetUsersPrivateKey({ privateKey: loginInformation.users_private_key }));
      this.store.dispatch(Start({ token: loginInformation.token, privateKey: loginInformation.users_private_key }));
    }
  }

  forgotPassword(email: string): void {
    this.store.dispatch(ForgotPassword({ email }));
  }

  resetPassword(new_password: string, userId: number, token: string): void {
    this.store.dispatch(ResetPassword({ newPassword: new_password, userId: userId, token: token }));
  }

  saveTokenAndUsersPrivateKey(token: string, users_private_key: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('users_private_key', users_private_key);
  }

  loadTokenAndUsersPrivateKey(): { token: string; users_private_key: string } {
    return {
      token: localStorage.getItem('token'),
      users_private_key: localStorage.getItem('users_private_key'),
    };
  }

  resetTokenAndUsersPrivateKey(): void {
    localStorage.clear();
  }

  getRlc(): Observable<IRlc> {
    return this.store.select((state) => state.core.rlc);
  }

  getUserPermissions(): Observable<string[]> {
    return this.store.select((state) => state.core.user_permissions);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.store.select((state) => state.core.all_permissions);
  }

  getAdminInformation(): Observable<AdminInformation> {
    return this.store.select((state) => state.core.admin);
  }

  getAdminNotifications(): Observable<number> {
    return this.store.select(selectAdminNotifications);
  }

  getAuthenticated(): Observable<boolean> {
    return this.store.select((state) => state.auth.authenticated);
  }

  getNotifications(): Observable<number> {
    return this.store.select((state) => state.core.notifications);
  }

  getUser(): Observable<IUser> {
    return this.store.select((state) => state.core.user);
  }

  getPermissions(): Observable<string[]> {
    return this.store.select((state) => state.core.user_permissions);
  }

  showSuccessSnackBar(message: string, duration = 10000): void {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar__success'];
    config.duration = duration;
    config.verticalPosition = 'top';
    this.snackBar.open(message, '', config);
  }

  showErrorSnackBar(message: string, duration = 10000): void {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar__error'];
    config.duration = duration;
    config.verticalPosition = 'top';
    this.snackBar.open(message, '', config);
  }
}
