import { IUser } from '../models/user.model';
import { SetAdminInformation, SetAllPermissions, SetNotifications, SetRlc, SetUser, SetUserPermissions } from './actions';
import { Permission } from '../models/permission.model';
import { IRlc } from '../models/rlc.model';
import { createReducer, on, Action } from '@ngrx/store';

export interface AdminInformation {
  profiles: number;
  recordDeletionRequests: number;
  recordPermitRequests: number;
}

export interface CoreState {
  user: IUser;
  all_permissions: Permission[];
  user_permissions: string[];
  rlc: IRlc;
  notifications: number;
  admin: AdminInformation;
}

const initialState: CoreState = {
  user: null,
  all_permissions: [],
  user_permissions: [],
  rlc: null,
  notifications: 0,
  admin: { profiles: 0, recordDeletionRequests: 0, recordPermitRequests: 0 },
};

const reducer = createReducer(
  initialState,
  on(SetAllPermissions, (state, action) => ({ ...state, all_permissions: action.payload })),
  on(SetUser, (state, action) => ({ ...state, user: action.payload })),
  on(SetRlc, (state, action) => ({ ...state, rlc: action.payload })),
  on(SetUserPermissions, (state, action) => ({ ...state, user_permissions: action.payload })),
  on(SetNotifications, (state, action) => ({ ...state, notifications: action.payload })),
  on(SetAdminInformation, (state, payload) => ({
    ...state,
    admin: {
      profiles: payload.profiles,
      recordDeletionRequests: payload.record_deletion_requests,
      recordPermitRequests: payload.record_permit_requests,
    },
  }))
);

export function coreReducer(state: CoreState | undefined, action: Action): CoreState {
  return reducer(state, action);
}
