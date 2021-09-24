import { IUser } from '../models/user.model';
import {
  CoreActions,
  DECREMENT_NOTIFICATION_COUNTER,
  INCREMENT_NOTIFICATION_COUNTER,
  SET_ALL_PERMISSIONS,
  SET_NOTIFICATIONS,
  SET_USER,
  SET_USER_PERMISSIONS,
} from './core.actions';
import { HasPermission, Permission } from '../models/permission.model';
import { Rlc } from '../models/rlc.model';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { RestrictedGroup } from '../models/group.model';

export interface CoreState {
  user: IUser;
  all_permissions: { [id: number]: Permission };
  user_permissions: HasPermission[];
  groups: { [id: number]: RestrictedGroup };
  rlc: Rlc;
  rlcs: { [id: number]: Rlc };
  notifications: number;
}

const initialState: CoreState = {
  user: null,
  all_permissions: {},
  user_permissions: [],
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
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_USER_PERMISSIONS:
      return {
        ...state,
        user_permissions: action.payload,
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
