import * as UserErrors from "./userError";
import * as GeneralErrors from "./general";
import * as AuthErrors from "./auth";

export default {
  ...UserErrors,
  ...GeneralErrors,
  ...AuthErrors,
};
