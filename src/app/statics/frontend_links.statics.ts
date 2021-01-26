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

import { RestrictedUser } from '../core/models/user.model';
import { RestrictedRecord, TokenRecord } from '../recordmanagement/models/record.model';
import { RestrictedGroup } from '../core/models/group.model';
import { Permission } from '../core/models/permission.model';
import { FullFolder } from '../filemanagement/models/folder.model';
import { GenerateSearchAppendix } from './api_urls.statics';

export const MAIN_PAGE_FRONT_URL = '';
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
export const INACTIVE_USERS_FRONT_URL = 'inactive_users';
export const DELETION_REQUESTS_FRONT_URL = 'records/deletion_requests';
export const FILES_FRONT_URL = 'files';
export const RECORD_POOL_FRONT_URL = 'records/record_pool';

export const GetProfileFrontUrl = (profile: RestrictedUser | string): string => {
    if (profile instanceof RestrictedUser) return `${PROFILES_FRONT_URL}/${profile.id}`;
    else return `${PROFILES_FRONT_URL}/${profile}`;
};

export const GetRecordSearchFrontUrl = (searchTerm: string): string => {
    return `${RECORDS_FRONT_URL}?search=${searchTerm}`;
};

export const GetRecordListFrontUrl = (searchParams: SearchParamsInterface) => {
    return GenerateSearchAppendix(RECORDS_FRONT_URL, searchParams);
};

export const GetRecordFrontUrl = (record: TokenRecord | string): string => {
    if (record instanceof TokenRecord) return `${RECORDS_FRONT_URL}/${record.id}`;
    else return `${RECORDS_FRONT_URL}/${record}`;
};

export const GetGroupFrontUrl = (group: RestrictedGroup | string): string => {
    if (group instanceof RestrictedGroup) return `${GROUPS_FRONT_URL}/${group.id}`;
    else return `${GROUPS_FRONT_URL}/${group}`;
};

export const GetPermissionFrontUrl = (permission: Permission | string): string => {
    if (permission instanceof Permission) return `${PERMISSIONS_FRONT_URL}/${permission.id}`;
    else return `${PERMISSIONS_FRONT_URL}/${permission}`;
};

export const GetFolderFrontUrlRelative = (currentPath: string, folder: FullFolder | string) => {
    if (!currentPath.endsWith('/') && currentPath !== '') {
        currentPath = currentPath + '/';
    }
    if (folder instanceof FullFolder) {
        return `${FILES_FRONT_URL}?path=${currentPath}${folder.name}`;
    } else {
        return `${FILES_FRONT_URL}?path=${currentPath}${folder}`;
    }
};

export const GetFolderFrontUrlAbsolute = (path: string) => {
    if (path === '') {
        return `${FILES_FRONT_URL}`;
    }
    return `${FILES_FRONT_URL}?path=${path}`;
};
