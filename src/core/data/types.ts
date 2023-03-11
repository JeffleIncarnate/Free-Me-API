export type User = {
  uuid: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  type: string;
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
  email: string;
  phonenumber: string;
  password: string;
  type: string;
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
  password: string;
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
