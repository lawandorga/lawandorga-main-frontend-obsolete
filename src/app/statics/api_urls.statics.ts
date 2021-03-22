/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { environment } from '../../environments/environment';

export const base = environment.apiUrl;
export const LOGIN_API_URL = base + 'api/login/';
export const RECORDS_API_URL = base + 'api/records/records/';
export const CLIENTS_BY_BIRTHDAY_API_URL = base + 'api/records/e_clients_by_birthday/';
export const RECORDS_STATICS_API_URL = base + 'api/records/statics/';
export const PROFILES_API_URL = base + 'api/profiles/';
export const CREATE_PROFILE_API_URL = base + 'api/create_profile/';
export const CREATE_RECORD_API_URL = base + 'api/records/records/';
export const RLCS_API_URL = base + 'api/rlcs/';
export const UPLOAD_SIGNING_BASE_API_URL = base + 'api/storage_up/';
export const RECORD_PERMISSIONS_LIST_API_URL = base + 'api/records/e_record_permission_requests/';
export const FORGOT_PASSWORD_API_URL = base + 'api/forgot_password/';
export const GROUPS_API_URL = base + 'api/groups/';
export const GROUP_MEMBER_API_URL = base + 'api/group_members/';
export const PERMISSION_API_URL = base + 'api/permissions/';
export const HAS_PERMISSION_API_URL = base + 'api/has_permission/';
export const HAS_PERMISSIONS_STATICS_API_URL = base + 'api/has_permission_statics/';
export const NEW_USER_REQUEST_API_URL = base + 'api/new_user_request/';
export const NEW_USER_REQUEST_ADMIT_API_URL = base + 'api/new_user_request_admit/';
export const LOGOUT_API_URL = base + 'api/logout/';
export const INACTIVE_USERS_API_URL = base + 'api/inactive_users/';
export const USER_HAS_PERMISSIONS_API_URL = base + 'api/user_has_permissions/';
export const RECORD_DELETIONS_API_URL = base + 'api/records/record_deletion_requests/';
export const PROCESS_RECORD_DELETIONS_API_URL =
    base + 'api/records/process_record_deletion_request/';
export const FOLDER_BASE_API_URL = base + 'api/files/folder';
export const FILES_UPLOAD_BASE_API_URL = base + 'api/files/upload';
export const FILES_DELETE_BASE_API_URL = base + 'api/files/delete';
export const FILES_DOWNLOAD_BASE_API_URL = base + 'api/files/download';
export const FILES_PERMISSION_FOR_FOLDER_BASE_API_URL = base + 'api/files/permission_for_folder/';
export const RECORD_POOL_API_URL = base + 'api/records/record_pool/';
export const POOL_RECORD_API_URL = base + 'api/records/pool_records/';
export const POOL_CONSULTANT_API_URL = base + 'api/records/pool_consultants/';
export const RLC_SETTINGS_API_URL = base + 'api/my_rlc_settings/';
export const NOTIFICATIONS_API_URL = base + 'api/notifications/';
export const NOTIFICATION_GROUPS_API_URL = base + 'api/notification_groups/';
export const UNREAD_NOTIFICATIONS_API_URL = base + 'api/notifications/unread/';
export const RECORD_DOCUMENT_DELETIONS_API_URL =
    base + 'api/records/record_document_deletion_requests/';
export const PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS =
    base + 'api/records/process_record_document_deletion_request/';

const CHECK_USER_ACTIVATION_API_URL = base + 'api/check_user_activation_link/';
const ACTIVATE_USER_ACTIVATION_API_URL = base + 'api/activate_user_activation_link/';
const RESET_PASSWORD_API_URL = base + 'api/reset_password/';
const SPECIAL_RECORD_BASE_API_URL = base + 'api/records/records/'; // deprecated??? is it?
const DOWNLOAD_SIGNING_BASE_API_URL = base + 'api/storage_down/'; // deprecated
const RECORD_DOCUMENT_BASE_API_URL = base + 'api/records/documents/';
const PERMISSION_FOR_GROUP_BASE_API_URL = base + 'api/permissions_for_group/';
const DOWNLOAD_ALL_RECORD_DOCUMENTS_BASE_API_URL = base + 'api/records/documents_download/';
const DOWNLOAD_ENCRYPTED_RECORD_DOCUMENT_BASE_API_URL = base + 'api/records/e_record/documents/';
const FILES_FOLDER_PERMISSIONS_BASE_API_URL = base + 'api/files/folder_permissions/';

export const GetSpecialProfileApiURL = (id: string | number) => {
    return `${PROFILES_API_URL}${id}/`;
};

export const GetRecordsSearchApiURL = (toSearch: string) => {
    return `${RECORDS_API_URL}?search=${toSearch}`;
};

export const GenerateSearchAppendix = (urlPrefix: string, searchParams: SearchParamsInterface) => {
    let urlAppendix = '';
    let first = true;
    if (searchParams.filter) {
        urlAppendix += `filter=${searchParams.filter}`;
        first = false;
    }
    if (searchParams.limit) {
        if (!first) {
            urlAppendix += '&';
        }
        urlAppendix += `limit=${searchParams.limit}`;
        first = false;
    }
    if (searchParams.offset) {
        if (!first) {
            urlAppendix += '&';
        }
        urlAppendix += `offset=${searchParams.offset}`;
        first = false;
    }
    if (searchParams.sort) {
        if (!first) {
            urlAppendix += '&';
        }
        urlAppendix += `sort=${searchParams.sort}`;
        first = false;
    }
    if (searchParams.sort_direction) {
        if (!first) {
            urlAppendix += '&';
        }
        urlAppendix += `sortdirection=${searchParams.sort_direction}`;
        first = false;
    }

    return first ? `${urlPrefix}` : `${urlPrefix}?${urlAppendix}`;
};

export const GetFullRecordSearchApiUrl = (searchParams: SearchParamsInterface) => {
    if (!searchParams.limit) {
        searchParams = {
            ...searchParams,
            limit: 10
        };
    }
    return GenerateSearchAppendix(RECORDS_API_URL, searchParams);
};

export const GetSpecialRecordApiURL = (id: string | number) => {
    return `${SPECIAL_RECORD_BASE_API_URL}${id}/`;
};

export const GetDownloadApiUrl = (file: string) => {
    return `${DOWNLOAD_SIGNING_BASE_API_URL}?file=${file}`;
};

export const GetUploadApiUrl = (file: File, fileDirectory: string = '') => {
    return `${UPLOAD_SIGNING_BASE_API_URL}?file_name=${file.name}&file_type=${file.type}&file_dir=${fileDirectory}`;
};

export const GetCreateRecordDocumentApiUrl = (record_id: string) => {
    return `${SPECIAL_RECORD_BASE_API_URL}${record_id}/documents`;
};

export const GetAddRecordMessageApiUrl = (record_id: string) => {
    return `${SPECIAL_RECORD_BASE_API_URL}${record_id}/add_message/`;
};

export const GetRecordDocumentApiUrl = (document_id: string) => {
    return `${RECORD_DOCUMENT_BASE_API_URL}${document_id}/`;
};

export const GetRecordPermissionRequestApiUrl = (record_id: string) => {
    return `${SPECIAL_RECORD_BASE_API_URL}${record_id}/request_permission`;
};

export const GetResetPasswordApiUrl = (link_id: string) => {
    return `${RESET_PASSWORD_API_URL}${link_id}/`;
};

export const GetSpecialGroupApiURL = (id: string | number) => {
    return `${GROUPS_API_URL}${id}/`;
};

export const GetSpecialPermissionApiURL = (id: string | number) => {
    return `${PERMISSION_API_URL}${id}/`;
};

export const GetSpecialHasPermissionApiURL = (id: string | number) => {
    return `${HAS_PERMISSION_API_URL}${id}/`;
};

export const GetPermissionsForGroupApiURL = (id: string | number) => {
    return `${PERMISSION_FOR_GROUP_BASE_API_URL}${id}/`;
};

export const GetCheckUserActivationApiUrl = (link: string) => {
    return `${CHECK_USER_ACTIVATION_API_URL}${link}/`;
};

export const GetActivateUserApiUrl = (link: string) => {
    return `${ACTIVATE_USER_ACTIVATION_API_URL}${link}/`;
};

export const GetDownloadAllRecordDocumentsApiUrl = (record_id: string) => {
    return GetSpecialRecordUploadDocumentsApiUrl(record_id);
};

export const GetSpecialRecordUploadDocumentsApiUrl = (record_id: string) => {
    return `${SPECIAL_RECORD_BASE_API_URL}${record_id}/documents/`;
};

export const GetDownloadEncryptedRecordDocumentApiUrl = (document_id: string) => {
    return `${DOWNLOAD_ENCRYPTED_RECORD_DOCUMENT_BASE_API_URL}${document_id}/`;
};

export const GetFolderInformationApiUrl = (path: string) => {
    if (path) return `${FOLDER_BASE_API_URL}?path=${path}`;
    return `${FOLDER_BASE_API_URL}`;
};

export const GetFolderPermissionsForFolderApiUrl = (id: string) => {
    return `${FILES_FOLDER_PERMISSIONS_BASE_API_URL}${id}/`;
};

export const GetFolderPermissionApiUrl = (id: string) => {
    return `${FILES_PERMISSION_FOR_FOLDER_BASE_API_URL}${id}/`;
};
