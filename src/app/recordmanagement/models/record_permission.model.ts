import { RestrictedUser } from '../../core/models/user.model';
import { TokenRecord } from './record.model';

export interface RecordPermissionRequest {
  id: string;
  request_from: RestrictedUser;
  request_processed: RestrictedUser | null;
  record: TokenRecord;
  requested: Date;
  processed_on: Date;
  can_edit: boolean;
  state: string;
}
