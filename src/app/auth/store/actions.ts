import { createAction, props } from '@ngrx/store';

// action strings
export const LOGIN = 'LOGIN';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USERS_PRIVATE_KEY = 'SET_USERS_PRIVATE_KEY';
export const LOGOUT = 'LOGOUT';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';

// all actions
export const Login = createAction(LOGIN, props<{ token: string; email: string; id: number; private_key: string }>());
export const SetToken = createAction(SET_TOKEN, props<{ token: string }>());
export const SetUsersPrivateKey = createAction(SET_USERS_PRIVATE_KEY, props<{ privateKey: string }>());
export const Logout = createAction(LOGOUT);
export const ForgotPassword = createAction(FORGOT_PASSWORD, props<{ email: string }>());
export const ResetPassword = createAction(RESET_PASSWORD, props<{ newPassword: string; userId: number; token: string }>());
