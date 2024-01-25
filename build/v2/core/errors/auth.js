"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenNotFound = exports.GeneralTokenFail = exports.TokenNotProvided = exports.InvalidTokenProvided = exports.IncorrectPassword = exports.YouDoNotExist = void 0;
const base_1 = require("./base");
class YouDoNotExist extends base_1.HTTPError {
    constructor() {
        super(404, {
            reason: "You do not exist in the database, so you are unable to get a token",
        });
    }
}
exports.YouDoNotExist = YouDoNotExist;
class IncorrectPassword extends base_1.HTTPError {
    constructor() {
        super(401, {
            reason: "The password you provided is not correct",
        });
    }
}
exports.IncorrectPassword = IncorrectPassword;
class InvalidTokenProvided extends base_1.HTTPError {
    constructor(error) {
        super(401, {
            reason: "The token you provided is not valid",
            error,
        });
    }
}
exports.InvalidTokenProvided = InvalidTokenProvided;
class TokenNotProvided extends base_1.HTTPError {
    constructor() {
        super(401, {
            reason: "You straight up forgor to provide a token",
        });
    }
}
exports.TokenNotProvided = TokenNotProvided;
class GeneralTokenFail extends base_1.HTTPError {
    constructor() {
        super(500, {
            reason: "There was an error with the token verification",
        });
    }
}
exports.GeneralTokenFail = GeneralTokenFail;
class RefreshTokenNotFound extends base_1.HTTPError {
    constructor() {
        super(401, {
            reason: "The refresh token provided was not found or has already been used (remember refresh tokens are single use)",
        });
    }
}
exports.RefreshTokenNotFound = RefreshTokenNotFound;
