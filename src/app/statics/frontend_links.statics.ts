export const LOGIN_FRONT_URL = 'login';
export const COLLAB_EDIT = 'collab/edit/';
export const COLLAB_VERSIONS = 'collab/versions/';
export const COLLAB_BASE = 'collab/';

export const GetCollabEditFrontUrl = (id: number) => {
  return `${COLLAB_EDIT}${id}`;
};

export const GetCollabVersionsFrontUrl = (id: number) => {
  return `${COLLAB_VERSIONS}${id}`;
};

export const GetCollabViewFrontUrl = (id: number) => {
  return `${COLLAB_BASE}${id}`;
};
