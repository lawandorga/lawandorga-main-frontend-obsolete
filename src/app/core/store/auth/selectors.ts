// import { createSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { AuthState } from './reducers';

export const selectAuthenticated = createSelector(
  (state: AuthState): boolean => state.authenticated,
  (authenticated: boolean) => authenticated
);

// export const authState = createFeatureSelector<AppState, AuthState>('auth');

// export const getAuthState = createSelector(authState, (state) => state.auth);

export const selectAuth = (state: AppState): AuthState => state.auth;

export const selectTimer = (state: AppState): number => state.auth.timer;

export const selectRemaining = (state: AppState): number => Math.round(60 * 30 - (new Date().valueOf() - selectTimer(state)) / 1000);

export const selectRemainingMinutes = (state: AppState): number => Math.floor(selectRemaining(state) / 60);

// export const selectTimer = createSelector(selectAuth, (state) => state.timer);
