import { AuthState } from './core/store/auth/reducers';
import { CoreState } from './core/store/core.reducers';

export interface AppState {
  auth: AuthState;
  core: CoreState;
}
