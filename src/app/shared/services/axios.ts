import axios from 'axios';

// types
export interface DjangoError {
  detail?: string;
}

// default options
const defaultOptions = {
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'private-key': localStorage.getItem('users_private_key').replace(/(?:\r\n|\r|\n)/g, ''),
  },
};

// create instance
const instance = axios.create(defaultOptions);

// export axios instance
export default instance;
