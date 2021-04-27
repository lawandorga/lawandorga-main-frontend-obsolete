import axios from 'axios';
import { environment } from '../../../environments/environment';

// types
export interface DjangoError {
  detail?: string;
  non_field_errors?: Array<string>;
}

// default options
const defaultOptions = {
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'private-key': localStorage.getItem('users_private_key').replace(/(?:\r\n|\r|\n)/g, '<linebreak>'),
  },
  baseURL: environment.apiUrl,
};

// create instance
const instance = axios.create(defaultOptions);

// export axios instance
export default instance;

// useful stuff
export const removeFromArray = (array: Array<any>, id: number): Array<any> => {  // eslint-disable-line
  const newArray = array.filter((item) => item.id !== id);  // eslint-disable-line
  return newArray;  // eslint-disable-line
};
