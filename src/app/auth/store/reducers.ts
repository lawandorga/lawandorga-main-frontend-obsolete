import { createReducer, on, Action } from '@ngrx/store';
import { Logout, SetUsersPrivateKey, SetToken } from './actions';

export interface AuthState {
  token: string;
  users_private_key: string;
  authenticated: boolean;
  timer: number;
}

const initialState: AuthState = {
  token: null,
  users_private_key: null,
  authenticated: false,
  timer: new Date().valueOf(),
};

const reducer = createReducer(
  initialState,
  on(SetToken, (state, action) => ({ ...state, token: action.token, authenticated: true })),
  on(SetUsersPrivateKey, (state, action) => ({ ...state, users_private_key: action.privateKey })),
  on(Logout, () => initialState)
);

export function authReducer(state: AuthState | undefined, action: Action): AuthState {
  return reducer(state, action);
}
