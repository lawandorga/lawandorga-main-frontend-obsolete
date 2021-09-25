import { Action } from '@ngrx/store';
import { IUser } from '../models/user.model';
import { HasPermission, Permission } from '../models/permission.model';
import { Rlc } from '../models/rlc.model';
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

export class SetAllPermissions implements Action {
  readonly type = SET_ALL_PERMISSIONS;

  constructor(public payload: Permission[]) {}
}

export class SetRlc implements Action {
  readonly type = SET_RLC;

  constructor(public payload: Rlc) {}
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: IUser) {}
}

export class SetUserPermissions implements Action {
  readonly type = SET_USER_PERMISSIONS;

  constructor(public payload: HasPermission[]) {}
}

export class StartLoadingHasPermissionStatics implements Action {
  readonly type = START_LOADING_HAS_PERMISSION_STATICS;
}

export class StartCheckingUserHasPermissions implements Action {
  readonly type = START_CHECKING_USER_HAS_PERMISSIONS;
}

export class SetNotifications implements Action {
  readonly type = SET_NOTIFICATIONS;

  constructor(public payload: number) {}
}

export class IncrementNotificationCounter implements Action {
  readonly type = INCREMENT_NOTIFICATION_COUNTER;
}

export class DecrementNotificationCounter implements Action {
  readonly type = DECREMENT_NOTIFICATION_COUNTER;
}

export class StartLoadingUnreadNotifications implements Action {
  readonly type = START_LOADING_UNREAD_NOTIFICATIONS;
}

export type CoreActions =
  | SetAllPermissions
  | SetUser
  | SetRlc
  | SetUserPermissions
  | StartLoadingHasPermissionStatics
  | StartCheckingUserHasPermissions
  | SetNotifications
  | IncrementNotificationCounter
  | DecrementNotificationCounter
  | StartLoadingUnreadNotifications;
