import { IUser } from '../models/user.model';
import {
  CoreActions,
  DECREMENT_NOTIFICATION_COUNTER,
  INCREMENT_NOTIFICATION_COUNTER,
  SET_ALL_PERMISSIONS,
  SET_NOTIFICATIONS,
  SET_RLC,
  SET_USER,
  SET_USER_PERMISSIONS,
} from './core.actions';
import { Permission } from '../models/permission.model';
import { Rlc } from '../models/rlc.model';

export interface CoreState {
  user: IUser;
  all_permissions: Permission[];
  user_permissions: string[];
  rlc: Rlc;
  notifications: number;
}

const initialState: CoreState = {
  user: null,
  all_permissions: [],
  user_permissions: [],
  rlc: null,
  notifications: 0,
};

export function coreReducer(state = initialState, action: CoreActions): CoreState {
  switch (action.type) {
    case SET_ALL_PERMISSIONS:
      return {
        ...state,
        all_permissions: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_RLC:
      return {
        ...state,
        rlc: action.payload,
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
