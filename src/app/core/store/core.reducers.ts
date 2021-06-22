import { FullUser } from '../models/user.model';
import {
  CoreActions,
  DECREMENT_NOTIFICATION_COUNTER,
  INCREMENT_NOTIFICATION_COUNTER,
  SET_ALL_PERMISSIONS,
  SET_GROUPS,
  SET_NOTIFICATIONS,
  SET_RLC,
  SET_RLCS,
  SET_USER,
  SET_USER_PERMISSIONS,
} from './core.actions';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedRlc } from '../models/rlc.model';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { RestrictedGroup } from '../models/group.model';

export interface CoreState {
  user: FullUser;
  all_permissions: { [id: number]: Permission };
  user_permissions: { [id: number]: HasPermission };
  groups: { [id: number]: RestrictedGroup };
  rlc: RestrictedRlc;
  rlcs: { [id: number]: RestrictedRlc };
  notifications: number;
}

const initialState: CoreState = {
  user: null,
  all_permissions: {},
  user_permissions: {},
  groups: {},
  rlc: null,
  rlcs: {},
  notifications: 0,
};

export function coreReducer(state = initialState, action: CoreActions) {
  switch (action.type) {
    case SET_ALL_PERMISSIONS:
      return {
        ...state,
        all_permissions: getIdObjects(action.payload),
      };
    case SET_GROUPS:
      return {
        ...state,
        groups: getIdObjects(action.payload),
      };

    case SET_RLC:
      return {
        ...state,
        rlc: action.payload,
      };
    case SET_RLCS:
      return {
        ...state,
        rlcs: getIdObjects(action.payload),
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_USER_PERMISSIONS:
      return {
        ...state,
        user_permissions: getIdObjects(action.payload),
      };

    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case INCREMENT_NOTIFICATION_COUNTER:
      return {
        ...state,
        notifications: state.notifications + 1,
      };
    case DECREMENT_NOTIFICATION_COUNTER:
      return {
        ...state,
        notifications: state.notifications - 1,
      };
    default:
      return state;
  }
}
