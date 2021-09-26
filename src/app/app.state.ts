import { AuthState } from './auth/store/reducers';
import { CoreState } from './core/store/core.reducers';

export interface AppState {
  auth: AuthState;
  core: CoreState;
}
