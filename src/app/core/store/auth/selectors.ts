// import { createSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { AuthState } from './reducers';

export const selectAuthenticated = createSelector(
  (state: AuthState): boolean => state.authenticated,
  (authenticated: boolean) => authenticated
);
