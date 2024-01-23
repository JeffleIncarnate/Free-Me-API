import { HTTPError } from "./base";

export class InvalidUsername extends HTTPError {
  constructor() {
    super(400, {
      reason:
        "The username provided is not valid. Username can not contain spaces or special characters",
    });
  }
}
