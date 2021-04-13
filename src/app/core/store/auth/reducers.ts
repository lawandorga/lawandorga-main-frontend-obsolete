import { createReducer, on, Action } from '@ngrx/store';
import { Logout, SetUsersPrivateKey, SetToken } from './actions';

export interface AuthState {
  token: string;
  users_private_key: string;
  authenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  users_private_key: null,
  authenticated: false,
};

const authReducer = createReducer(
  initialState,
  on(SetToken, (state, action) => ({ ...state, token: action.token, authenticated: true })),
  on(SetUsersPrivateKey, (state, action) => ({ ...state, users_private_key: action.privateKey })),
  on(Logout, () => initialState)
);

export function reducer(state: AuthState | undefined, action: Action): AuthState {
  return authReducer(state, action);
}
