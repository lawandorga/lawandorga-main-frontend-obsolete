import { AuthState } from './auth/store/reducers';
import { CoreState } from './core/store/reducers';

export interface AppState {
  auth: AuthState;
  core: CoreState;
}
