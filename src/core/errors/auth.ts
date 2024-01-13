import { HTTPError } from "./base";

export class YouDoNotExist extends HTTPError {
  constructor() {
    super(404, {
      reason:
        "You do not exist in the database, so you are unable to get a token",
    });
  }
}

export class IncorrectPassword extends HTTPError {
  constructor() {
    super(401, {
      reason: "The password you provided is not correct",
    });
  }
}
