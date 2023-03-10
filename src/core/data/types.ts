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
    create_users: false;
    delete_users: false;
    update_users: false;
  };
};
