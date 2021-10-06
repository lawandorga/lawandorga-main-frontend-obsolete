import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LOGIN, FORGOT_PASSWORD, RESET_PASSWORD, LOGOUT, SetToken, SetUsersPrivateKey } from './actions';
import { DjangoError } from 'src/app/shared/services/axios';
import { FORGOT_PASSWORD_API_URL, GetResetPasswordApiUrl, LOGOUT_API_URL } from 'src/app/statics/api_urls.statics';
import { AppSandboxService } from 'src/app/core/services/app-sandbox.service';
import { LOGIN_FRONT_URL } from 'src/app/statics/frontend_links.statics';
import { Start } from 'src/app/core/store/actions';

@Injectable()
export class AuthEffects {
  constructor(private actions: Actions, private http: HttpClient, private router: Router, private appSB: AppSandboxService) {}

  login = createEffect(() =>
    this.actions.pipe(
      ofType(LOGIN),
      mergeMap((payload: { token: string; email: string; id: number; private_key: string }) => {
        this.appSB.saveTokenAndUsersPrivateKey(payload.token, payload.private_key);
        void this.router.navigate(['/dashboard/']);
        return [
          SetToken({ token: payload.token }),
          SetUsersPrivateKey({ privateKey: payload.private_key }),
          Start({ token: payload.token, privateKey: payload.private_key }),
        ];
      })
    )
  );

  forgotPassword = createEffect(() =>
    this.actions.pipe(
      ofType(FORGOT_PASSWORD),
      mergeMap((payload: { email: string }) =>
        this.http.post(FORGOT_PASSWORD_API_URL, { email: payload.email }).pipe(
          catchError((error: HttpErrorResponse) => {
            const djangoError = error.error as DjangoError;
            this.appSB.showErrorSnackBar(djangoError.detail);
            return [];
          }),
          mergeMap(() => {
            this.appSB.showSuccessSnackBar('a reactivation email was sent to the given email address');
            void this.router.navigate([LOGIN_FRONT_URL]);
            return [];
          })
        )
      )
    )
  );

  resetPassword = createEffect(() =>
    this.actions.pipe(
      ofType(RESET_PASSWORD),
      mergeMap((payload: { newPassword: string; userId: number; token: string }) =>
        this.http
          .post(GetResetPasswordApiUrl(payload.userId), {
            new_password: payload.newPassword,
            token: payload.token,
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              const djangoError = error.error as DjangoError;
              this.appSB.showErrorSnackBar(djangoError.detail);
              return [];
            }),
            mergeMap(() => {
              this.appSB.showSuccessSnackBar('Your password was successfully reset. An admin needs to admit you back into the team, now.');
              void this.router.navigate([LOGIN_FRONT_URL]);
              return [];
            })
          )
      )
    )
  );

  logout = createEffect(() =>
    this.actions.pipe(
      ofType(LOGOUT),
      mergeMap(() =>
        this.http.post(LOGOUT_API_URL, {}).pipe(
          mergeMap(() => {
            this.appSB.resetTokenAndUsersPrivateKey();
            void this.router.navigate([LOGIN_FRONT_URL]);
            return [];
          }),
          catchError((error: HttpErrorResponse) => {
            const djangoError = error.error as DjangoError;
            this.appSB.showErrorSnackBar(djangoError.detail);
            return [];
          })
        )
      )
    )
  );
}
