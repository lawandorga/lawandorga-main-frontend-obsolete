import { createAction, props } from '@ngrx/store';
import { IUser } from '../models/user.model';
import { Permission } from '../models/permission.model';
import { IRlc } from '../models/rlc.model';

// action strings
export const ADD_NOTIFICATIONS = 'ADD_NOTIFICATIONS';
export const SET_ALL_PERMISSIONS = 'SET_ALL_PERMISSIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_USER = 'SET_USER';
export const SET_USER_PERMISSIONS = 'SET_USER_PERMISSIONS';
export const START_CHECKING_USER_ACTIVATION_LINK = 'START_CHECKING_USER_ACTIVATION_LINK';
export const START_CHECKING_USER_HAS_PERMISSIONS = 'START_CHECKING_USER_HAS_PERMISSIONS';
export const START_LOADING_HAS_PERMISSION_STATICS = 'START_LOADING_HAS_PERMISSION_STATICS';
export const START_LOADING_UNREAD_NOTIFICATIONS = 'START_LOADING_UNREAD_NOTIFICATIONS';
export const DECREMENT_NOTIFICATION_COUNTER = 'DECREMENT_NOTIFICATION_COUNTER';
export const INCREMENT_NOTIFICATION_COUNTER = 'INCREMENT_NOTIFICATION_COUNTER';
export const SET_RLC = 'SET_RLC';
export const LOAD_ADMIN_INFORMATION = 'LOAD_ADMIN_INFORMATION';
export const SET_ADMIN_INFORMATION = 'SET_ADMIN_INFORMATION';
export const START = 'START';
export const LOAD_STATIC_INFORMATION = 'LOAD_STATIC_INFORMATION';

// all actions
export const LoadStaticInformation = createAction(LOAD_STATIC_INFORMATION, props<{ token: string }>());
export const Start = createAction(START, props<{ token: string; privateKey: string }>());
export const LoadAdminInformation = createAction(LOAD_ADMIN_INFORMATION);
export const SetAdminInformation = createAction(
  SET_ADMIN_INFORMATION,
  props<{ profiles: number; record_deletion_requests: number; record_permit_requests: number }>()
);
export const SetAllPermissions = createAction(SET_ALL_PERMISSIONS, props<{ payload: Permission[] }>());
export const SetRlc = createAction(SET_RLC, props<{ payload: IRlc }>());
export const SetUser = createAction(SET_USER, props<{ payload: IUser }>());
export const SetUserPermissions = createAction(SET_USER_PERMISSIONS, props<{ payload: string[] }>());
export const StartLoadingHasPermissionStatics = createAction(START_LOADING_HAS_PERMISSION_STATICS);
export const StartCheckingUserHasPermissions = createAction(START_CHECKING_USER_HAS_PERMISSIONS);
export const SetNotifications = createAction(SET_NOTIFICATIONS, props<{ payload: number }>());
export const IncrementNotificationCounter = createAction(INCREMENT_NOTIFICATION_COUNTER);
export const DecrementNotificationCounter = createAction(DECREMENT_NOTIFICATION_COUNTER);
export const StartLoadingUnreadNotifications = createAction(START_LOADING_UNREAD_NOTIFICATIONS);
