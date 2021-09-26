/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
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
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthState } from '../store/auth/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AppSandboxService } from './app-sandbox.service';
import { Logout, ResetTimer } from '../store/auth/actions';
import { environment } from '../../../environments/environment';
import { DjangoError } from 'src/app/shared/services/axios';
import { AppState } from 'src/app/app.state';

const errorCodes = (code) => code === 400 || code === 403 || code === 405;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>, private appSB: AppSandboxService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.dispatch(ResetTimer());

    return this.store.select('auth').pipe(
      take(1),
      switchMap((authState: AuthState) => {
        let newHeaders = req.headers;
        if (authState.authenticated && authState.token && authState.users_private_key) {
          newHeaders = newHeaders.set('Authorization', 'Token ' + authState.token);
          newHeaders = newHeaders.set('private-key', authState.users_private_key.replace(/(?:\r\n|\r|\n)/g, '<linebreak>'));
        }

        const clonedRequest = req.clone({ headers: newHeaders, url: `${environment.apiUrl}${req.url}` });

        return next.handle(clonedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            // check if the backend returned an unsuccessful response code
            if (error.status === 401) {
              // the key is not valid anymore log the user out
              this.store.dispatch(Logout());
              this.appSB.showErrorSnackBar('You were logged out, please login again.');
            }
            // if the backend returned a message show that message
            else if (errorCodes(error.status) && !(error.error instanceof Blob)) {
              const djangoError = error.error as DjangoError;
              this.appSB.showErrorSnackBar(djangoError.detail);
            } else if (errorCodes(error.status) && error.error instanceof Blob) {
              const reader = new FileReader();
              const appSB = this.appSB;
              reader.onloadend = function (event) {
                const djangoError = JSON.parse(event.target.result as string) as DjangoError;
                appSB.showErrorSnackBar(djangoError.detail);
              };
              reader.readAsText(error.error);
            } else {
              this.appSB.showErrorSnackBar('Error');
            }
            // throw the error so that a form might be able to handle it accordingly
            throw error;
          })
        );
      })
    );
  }
}
