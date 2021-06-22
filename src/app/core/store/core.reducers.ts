import { FullUser } from '../models/user.model';
import {
  ADD_SINGLE_HAS_PERMISSION,
  CoreActions,
  DECREMENT_NOTIFICATION_COUNTER,
  INCREMENT_NOTIFICATION_COUNTER,
  REMOVE_ACTUAL_HAS_PERMISSIONS,
  REMOVE_SINGLE_HAS_PERMISSION,
  SET_ACTUAL_HAS_PERMISSIONS,
  SET_ALL_PERMISSIONS,
  SET_GROUPS,
  SET_NOTIFICATIONS,
  SET_OTHER_USERS,
  SET_RLC,
  SET_RLCS,
  SET_SPECIAL_PERMISSION,
  SET_USER,
  SET_USER_PERMISSIONS,
} from './core.actions';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedRlc } from '../models/rlc.model';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { RestrictedGroup } from '../models/group.model';

export interface CoreState {
  user: FullUser;
  other_users: { [id: number]: FullUser };
  all_permissions: { [id: number]: Permission };
  user_permissions: { [id: number]: HasPermission };
  groups: { [id: number]: RestrictedGroup };
  actual_has_permissions: { [id: number]: HasPermission };
  rlc: RestrictedRlc;
  special_permission: Permission;
  rlcs: { [id: number]: RestrictedRlc };
  notifications: number;
}

const initialState: CoreState = {
  user: null,
  other_users: {},
  all_permissions: {},
  user_permissions: {},
  groups: {},
  actual_has_permissions: {},
  rlc: null,
  special_permission: null,
  rlcs: {},
  notifications: 0,
};

export function coreReducer(state = initialState, action: CoreActions) {
  switch (action.type) {
    case ADD_SINGLE_HAS_PERMISSION:
      const hasPerm: HasPermission = action.payload;
      return {
        ...state,
        actual_has_permissions: {
          ...state.actual_has_permissions,
          [hasPerm.id]: hasPerm,
        },
      };
    case REMOVE_ACTUAL_HAS_PERMISSIONS:
      return {
        ...state,
        actual_has_permissions: {},
      };
    case REMOVE_SINGLE_HAS_PERMISSION:
      const hasPermissions = state.actual_has_permissions;
      delete hasPermissions[action.payload];

      return {
        ...state,
        actual_has_permissions: hasPermissions,
      };

    case SET_ACTUAL_HAS_PERMISSIONS:
      return {
        ...state,
        actual_has_permissions: getIdObjects(action.payload),
      };
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
    case SET_OTHER_USERS:
      return {
        ...state,
        other_users: getIdObjects(action.payload),
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

    case SET_SPECIAL_PERMISSION:
      return {
        ...state,
        special_permission: action.payload,
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
