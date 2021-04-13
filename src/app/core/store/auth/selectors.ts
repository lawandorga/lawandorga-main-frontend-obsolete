// import { createSelector } from '@ngrx/store';
import { AuthState } from './reducers';

export const getIsAuthenticated = (state: AuthState): boolean => state.authenticated;
