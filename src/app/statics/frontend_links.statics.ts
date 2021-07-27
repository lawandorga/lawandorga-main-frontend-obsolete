import { TokenRecord } from '../recordmanagement/models/record.model';
export const MAIN_PAGE_FRONT_URL = 'dashboard';
export const REGISTER_FRONT_URL = 'register';
export const LOGIN_FRONT_URL = 'login';
export const FORGOT_PASSWORD_FRONT_URL = 'forgot-password';
export const PROFILES_FRONT_URL = 'profiles';
export const OWN_PROFILE_FRONT_URL = 'profile';
export const RECORDS_FRONT_URL = 'records';
export const RECORDS_ADD_FRONT_URL = 'records/add';
export const RECORDS_PERMIT_REQUEST_FRONT_URL = 'records/permit_requests';
export const STATISTICS_FRONT_URL = 'statistics';
export const GROUPS_FRONT_URL = 'groups';
export const PERMISSIONS_FRONT_URL = 'permissions';
export const ACCEPT_NEW_USER_REQUESTS_FRONT_URL = 'new_user_requests';
export const LEGAL_NOTICE_FRONT_URL = 'legal_notice';
export const PRIVACY_STATEMENT_FRONT_URL = 'privacy_statement';
export const DELETION_REQUESTS_FRONT_URL = 'records/deletion_requests';
export const FILES_FRONT_URL = 'files';
export const RECORD_POOL_FRONT_URL = 'records/record_pool';
export const COLLAB_EDIT = 'collab/edit/';
export const COLLAB_VERSIONS = 'collab/versions/';
export const COLLAB_BASE = 'collab/';

export const GetRecordFrontUrl = (record: TokenRecord | string): string => {
  if (record instanceof TokenRecord) return `${RECORDS_FRONT_URL}/${record.id}`;
  else return `${RECORDS_FRONT_URL}/${record}`;
};

export const GetCollabEditFrontUrl = (id: number) => {
  return `${COLLAB_EDIT}${id}`;
};

export const GetCollabVersionsFrontUrl = (id: number) => {
  return `${COLLAB_VERSIONS}${id}`;
};

export const GetCollabViewFrontUrl = (id: number) => {
  return `${COLLAB_BASE}${id}`;
};
