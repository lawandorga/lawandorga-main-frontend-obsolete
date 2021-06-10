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
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ForgotPassword, ReloadStaticInformation, ResetPassword, SetUsersPrivateKey, SetToken } from '../store/auth/actions';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppState } from 'src/app/app.state';

@Injectable()
export class AppSandboxService {
  savedLocation = '';
  navbar;

  static getPrivateKeyPlaceholder(): any {
    let headers = new HttpHeaders();
    headers = headers.append('private-key', 'placeholder');
    return { headers };
  }

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
