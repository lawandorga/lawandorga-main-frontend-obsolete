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
import { AuthState } from '../store/auth/auth.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AppSandboxService } from './app-sandbox.service';
import { CoreSandboxService } from './core-sandbox.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private store: Store<AuthState>,
        private appSB: AppSandboxService,
        private coreSB: CoreSandboxService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store
            .select(state => state['auth'])
            .pipe(
                take(1),
                switchMap((authState: AuthState) => {
                    let newHeaders = req.headers;
                    newHeaders = newHeaders.append('Authorization', 'Token ' + authState.token);
                    if (newHeaders.get('private-key')) {
                        newHeaders = newHeaders.delete('private-key');
                        let priv_key = authState.users_private_key;
                        priv_key = priv_key.replace(/(?:\r\n|\r|\n)/g, '<linebreak>');
                        newHeaders = newHeaders.append('private-key', priv_key);
                    }
                    const clonedRequest = req.clone({ headers: newHeaders });

                    return next.handle(clonedRequest).pipe(catchError((error: HttpErrorResponse, caught) => {                        
                        // there is an error with the client's connection    
                        if (error.error instanceof ErrorEvent || error.error instanceof ProgressEvent) {
                            this.coreSB.showErrorSnackBar("There seems to be an error with your connection. Please make sure you're connected to the internet.")
                        } 
                        // the backend returned an unsuccessful response code
                        else {
                            // if the key is not valid anymore log the user out
                            if (error.status === 401) {
                                this.appSB.saveLocation();
                                this.appSB.logout();
                                this.coreSB.showErrorSnackBar('You were logged out, please login again.');
                            } 
                            // if the backend returned a message show that message
                            else {                                
                                this.coreSB.showErrorSnackBar(error.error.message)
                            }
                        }
                        throw error
                    }))
                })
            );
    }
}
