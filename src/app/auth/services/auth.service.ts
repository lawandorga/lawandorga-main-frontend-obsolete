import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ForgotPassword, ResetPassword } from 'src/app/auth/store/actions';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';

@Injectable()
export class AuthService {
  constructor(private store: Store<AppState>) {}

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

  getAuthenticated(): Observable<boolean> {
    return this.store.select((state) => state.auth.authenticated);
  }
}
