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
import { AppState } from '../../store/app.reducers';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import {
    ForgotPassword,
    ReloadStaticInformation,
    ResetPassword,
    SetUsersPrivateKey,
    SetToken,
    StartLoggingOut,
    TryLogin
} from '../store/auth/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth/auth.reducers';
import { HttpHeaders } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable()
export class AppSandboxService {
    savedLocation = '';
    toggleNav: Function;
    navbar;

    static getPrivateKeyPlaceholder(): any {
        let headers = new HttpHeaders();
        headers = headers.append('private-key', 'placeholder');
        return { headers };
    }

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private media: MediaMatcher
    ) {}

    isAuthenticated(): boolean {
        let isAuthenticated = false;
        this.store
            .pipe(
                take(1),
                select((state: any) => state.auth.authenticated)
            )
            .subscribe(authenticated => (isAuthenticated = authenticated));
        return isAuthenticated;
    }

    logout() {
        // this.resetTokenAndUsersPrivateKey();
        this.store.dispatch(new StartLoggingOut());
        // this.router.navigate([LOGIN_FRONT_URL]);
    }

    login(username: string, password: string) {
        this.store.dispatch(new TryLogin({ username, password }));
    }

    startApp(): Observable<AuthState> {
        const loginInformation = this.loadTokenAndUsersPrivateKey();
        if (loginInformation.token !== null && loginInformation.token !== '') {
            this.store.dispatch(new SetToken(loginInformation.token));
            this.store.dispatch(new SetUsersPrivateKey(loginInformation.users_private_key));
            this.store.dispatch(new ReloadStaticInformation({ token: loginInformation.token }));
        }
        return this.store.pipe(select('auth'));
    }

    saveLocation() {
        this.savedLocation = this.router.url;
    }

    forgotPassword(email: string): void {
        this.store.dispatch(new ForgotPassword({ email }));
    }

    resetPassword(new_password: string, userId: number, token: string): void {
        this.store.dispatch(
            new ResetPassword({ newPassword: new_password, userId: userId, token: token })
        );
    }

    saveTokenAndUsersPrivateKey(token: string, users_private_key: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('users_private_key', users_private_key);
    }

    loadTokenAndUsersPrivateKey(): any {
        return {
            token: localStorage.getItem('token'),
            users_private_key: localStorage.getItem('users_private_key')
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

    toggleNavbar(): void {
        if (this.navbar) this.navbar.toggle();
    }

    isOnMobile(): boolean {
        return this.media.matchMedia('(max-width: 600px)').matches;
    }
}
