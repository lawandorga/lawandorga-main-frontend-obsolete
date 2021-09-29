export const base = ''; // environment.apiUrl;
export const LOGIN_API_URL = base + 'api/profiles/login/';
export const PROFILES_API_URL = base + 'api/profiles/';
export const CREATE_PROFILE_API_URL = base + 'api/profiles/';
export const RLCS_API_URL = base + 'api/rlcs/';
export const FORGOT_PASSWORD_API_URL = base + 'api/profiles/password_reset/';
export const GROUPS_API_URL = base + 'api/groups/';
export const GROUP_MEMBER_API_URL = base + 'api/group_members/';
export const HAS_PERMISSIONS_STATICS_API_URL = base + 'api/has_permission_statics/';
export const LOGOUT_API_URL = base + 'api/profiles/logout/';
export const USER_HAS_PERMISSIONS_API_URL = base + 'api/user_has_permissions/';
export const NOTIFICATIONS_API_URL = base + 'api/notifications/';
export const NOTIFICATION_GROUPS_API_URL = base + 'api/notification_groups/';
export const UNREAD_NOTIFICATIONS_API_URL = base + 'api/notifications/unread/';
export const STATISTICS_RECORDS_API_URL = base + 'api/records/statistics/';

export const COLLAB_COLLAB_DOCUMENTS_API_URL = base + 'api/collab/collab_documents/';
const COLLAB_TEXT_DOCUMENTS_API_URL = base + 'api/collab/text_documents/';
export const COLLAB_PERMISSIONS_API_URL = base + 'api/collab/collab_permission/';
const COLLAB_PERMISSION_FOR_DOCUMENT_API_URL = base + 'api/collab/permission_for_collab_document/';
const COLLAB_TEXT_DOCUMENT_VERSIONS = base + 'api/collab/text_document_version/';

const CHECK_USER_ACTIVATION_API_URL = base + 'api/profiles/';
const RESET_PASSWORD_API_URL = base + 'api/profiles/';

export const GetProfilesDetailApiUrl = (id: number) => {
  return `${PROFILES_API_URL}${id}/`;
};

export const GetProfilesUnlockApiUrl = (id: number) => {
  return `${PROFILES_API_URL}${id}/unlock/`;
};

export const GetSpecialProfileApiURL = (id: string | number) => {
  return `${PROFILES_API_URL}${id}/`;
};

export const GetResetPasswordApiUrl = (userId: number) => {
  return `${RESET_PASSWORD_API_URL}${userId}/password_reset_confirm/`;
};

export const GetCheckUserActivationApiUrl = (userId: number, token: string) => {
  return `${CHECK_USER_ACTIVATION_API_URL}${userId}/activate/${token}/`;
};

export const GetCollabTextDocumentApiUrl = (id: number) => {
  return `${COLLAB_TEXT_DOCUMENTS_API_URL}${id}/`;
};

export const GetCollabEditingApiUrl = (id: number) => {
  return `${GetCollabTextDocumentApiUrl(id)}editing/`;
  // return `${COLLAB_EDITING_API_URL}${id}/`;
};

export const GetCollabTextDocumentVersionsApiUrl = (text_document_id: number) => {
  return `${COLLAB_TEXT_DOCUMENTS_API_URL}${text_document_id}/versions/`;
};

export const GetCollabTextDocumentVersionsModelApiUrl = (text_version_id: number) => {
  return `${COLLAB_TEXT_DOCUMENT_VERSIONS}${text_version_id}/`;
};

export const GetSpecialCollabDocumentApiUrl = (id: number) => {
  return `${COLLAB_COLLAB_DOCUMENTS_API_URL}${id}/`;
};

export const GetCollabDocumentPermissionApiUrl = (id: number) => {
  return `${GetSpecialCollabDocumentApiUrl(id)}permissions/`;
};

export const GetCollabDocumentPermissionForDocumentApiUrl = (id: number) => {
  return `${COLLAB_PERMISSION_FOR_DOCUMENT_API_URL}${id}/`;
};
