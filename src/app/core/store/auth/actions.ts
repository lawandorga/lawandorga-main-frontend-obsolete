import { createAction, props } from '@ngrx/store';

// action strings
export const LOGIN = 'LOGIN';
export const TRY_RELOAD_STATIC_INFORMATION = 'TRY_RELOAD_STATIC_INFORMATION';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USERS_PRIVATE_KEY = 'SET_USERS_PRIVATE_KEY';
export const LOGOUT = 'LOGOUT';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const START_LOGGING_OUT = 'START_LOGGING_OUT';
export const SET_TIMER = 'SET_TIMER';

// all actions
export const TryLogin = createAction(LOGIN, props<{ username: string; password: string }>());
export const ReloadStaticInformation = createAction(TRY_RELOAD_STATIC_INFORMATION, props<{ token: string }>());
export const SetToken = createAction(SET_TOKEN, props<{ token: string }>());
export const SetUsersPrivateKey = createAction(SET_USERS_PRIVATE_KEY, props<{ privateKey: string }>());
export const ResetTimer = createAction(SET_TIMER);
export const Logout = createAction(LOGOUT);
export const ForgotPassword = createAction(FORGOT_PASSWORD, props<{ email: string }>());
export const ResetPassword = createAction(RESET_PASSWORD, props<{ newPassword: string; userId: number; token: string }>());
export const StartLoggingOut = createAction(START_LOGGING_OUT);
