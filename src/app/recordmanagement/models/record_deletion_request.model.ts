import { RestrictedUser } from '../../core/models/user.model';
import { TokenRecord } from './record.model';

export interface RecordDeletionRequest {
  id: string;
  request_from: RestrictedUser;
  request_processed: RestrictedUser | null;
  requested: Date;
  processed_on: Date;
  state: string;
  explanation: string;
  record?: TokenRecord;
}
