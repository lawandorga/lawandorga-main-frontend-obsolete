import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ForgotPassword, ReloadStaticInformation, ResetPassword, SetUsersPrivateKey, SetToken } from '../store/auth/actions';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppState } from 'src/app/app.state';

@Injectable()
export class AppSandboxService {
  savedLocation = '';
  navbar;

  constructor(private store: Store<AppState>, private router: Router, private media: MediaMatcher) {}

  isAuthenticated(): boolean {
    let isAuthenticated = false;
    this.store
      .pipe(
        take(1),
        select((state: AppState) => state.auth.authenticated)
      )
      .subscribe((authenticated) => (isAuthenticated = authenticated));
    return isAuthenticated;
  }

  startApp(): void {
    const loginInformation = this.loadTokenAndUsersPrivateKey();
    if (loginInformation.token !== null && loginInformation.token !== '') {
      this.store.dispatch(SetToken({ token: loginInformation.token }));
      this.store.dispatch(SetUsersPrivateKey({ privateKey: loginInformation.users_private_key }));
      this.store.dispatch(ReloadStaticInformation({ token: loginInformation.token }));
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

  setNavbar(navbar) {
    this.navbar = navbar;
  }

  closeNavbar(): void {
    if (this.navbar) this.navbar.close();
  }

  openNavbar(): void {
    if (this.navbar) this.navbar.open();
  }

  isOnMobile(): boolean {
    return this.media.matchMedia('(max-width: 600px)').matches;
  }
}
