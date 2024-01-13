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

export class InvalidTokenProvided extends HTTPError {
  constructor(error: string) {
    super(401, {
      reason: "The token you provided is not valid",
      error,
    });
  }
}

export class TokenNotProvided extends HTTPError {
  constructor() {
    super(401, {
      reason: "You straight up forgor to provide a token",
    });
  }
}

export class GeneralTokenFail extends HTTPError {
  constructor() {
    super(500, {
      reason: "There was an error with the token verification",
    });
  }
}

export class RefreshTokenNotFound extends HTTPError {
  constructor() {
    super(401, {
      reason:
        "The refresh token provided was not found or has already been used (remember refresh tokens are single use)",
    });
  }
}
