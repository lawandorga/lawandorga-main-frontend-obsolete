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

import { Injectable, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthState } from '../store/auth/reducers';
import { LOGIN_FRONT_URL } from '../../statics/frontend_links.statics';

@Injectable()
export class AuthGuardService implements CanActivate {
  lastVisitedUrl: string = undefined;
  authenticated = false;

  constructor(private router: Router, private store: Store<AuthState>) {
    store.pipe(select((state: any) => state.auth.authenticated)).subscribe((authenticated) => (this.authenticated = authenticated));
  }

  canActivate(): boolean {
    return this.authenticated;
  }

  getLastVisitedUrl(): string {
    let returnVal: string;
    if (this.lastVisitedUrl) returnVal = this.lastVisitedUrl;
    this.lastVisitedUrl = undefined;
    return returnVal;
  }
}
