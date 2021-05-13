import axios from 'axios';
import { RestrictedGroup } from 'src/app/core/models/group.model';
import { HasPermission, Permission } from 'src/app/core/models/permission.model';
import { FullUser } from 'src/app/core/models/user.model';
import { Message } from 'src/app/recordmanagement/models/message.model';
import { RecordDeletionRequest } from 'src/app/recordmanagement/models/record_deletion_request.model';
import { RecordDocument } from 'src/app/recordmanagement/models/record_document.model';
import { RecordPermissionRequest } from 'src/app/recordmanagement/models/record_permission.model';
import { environment } from '../../../environments/environment';

// types
export interface DjangoError {
  detail?: string;
  non_field_errors?: Array<string>;
}

// default options
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: environment.apiUrl,
};

// create instance
const instance = axios.create(defaultOptions);

// default options
function token(): string {
  const token = localStorage.getItem('token');
  return token ? token : '';
}

function privateKey(): string {
  const privateKey = localStorage.getItem('users_private_key');
  return privateKey ? privateKey : '';
}

instance.interceptors.request.use((config) => {
  // eslint-disable-next-line
  config.headers['Authorization'] = `Token ${token()}`;
  // eslint-disable-next-line
  config.headers['private-key'] = privateKey().replace(/(?:\r\n|\r|\n)/g, '<linebreak>');
  return config;
});

// export axios instance
export default instance;

// useful stuff
export interface BaseModel {
  id: number | string;
  [key: string]: unknown;
}
export type DjangoModel =
  | BaseModel
  | FullUser
  | HasPermission
  | Permission
  | RestrictedGroup
  | Message
  | RecordDocument
  | RecordPermissionRequest
  | RecordDeletionRequest;

export interface SubmitData {
  [key: string]: string | number;
}

export const removeFromArray = (array: DjangoModel[], id: number): DjangoModel[] => {
  const newArray = array.filter((item) => item.id !== id);
  return newArray;
};

export const addToArray = (array: DjangoModel[], data: DjangoModel): DjangoModel[] => {
  array.push(data);
  return [...array];
};

export const replaceInArray = (array: DjangoModel[], data: DjangoModel): DjangoModel[] => {
  const index = array.findIndex((item) => item.id === data.id);
  array.splice(index, 1, data);
  return [...array];
};
