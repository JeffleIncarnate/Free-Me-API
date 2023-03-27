export type User = {
  uuid: string;
  username: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
  address: string;
  email: string;
  phonenumber: string;
  password: string;
  type: string;
  nzbn: number;
  gst: number;
  socials: {
    facebook: string;
    linkedIn: string;
  };
  scopes: {
    getSelf: true;
    mofifySelf: true;
    deleteSelf: true;
    getOtherUsers: false;
    createUsers: false;
    deleteUsers: false;
    updateUsers: false;
  };
};

export type VerifyEmail = {
  uuid: string;
  username: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
  address: string;
  email: string;
  phonenumber: string;
  password: string;
  type: string;
  nzbn: number;
  gst: number;
  socials: {
    facebook: string;
    linkedIn: string;
  };
  scopes: {
    getSelf: false;
    mofifySelf: false;
    deleteSelf: false;
    getOtherUsers: false;
    createUsers: false;
    deleteUsers: false;
    updateUsers: false;
  };
};

export type AccessTokenUser = {
  uuid: string;
  scopes: {
    getSelf: true;
    mofifySelf: true;
    deleteSelf: true;
    getOtherUsers: false;
    createUsers: false;
    deleteUsers: false;
    updateUsers: false;
  };
};

export type CreatePost = {
  postId: number;
  posterId: string;
  title: string;
  description: string;
  place: string;
  company: string;
  time: number;
};

export type UpdateUser = {
  uuid: string;
  col: string;
  dataTo: string;
};
