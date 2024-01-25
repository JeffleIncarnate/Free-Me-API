"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUnknownError = exports.PrismaErr = void 0;
const base_1 = require("./base");
class PrismaErr extends base_1.HTTPError {
    constructor(prismaErr) {
        super(500, {
            reason: "Some error occurred while updating database",
            err: prismaErr,
        });
    }
}
exports.PrismaErr = PrismaErr;
class PrismaUnknownError extends base_1.HTTPError {
    constructor() {
        super(500, {
            reason: "Unknown database error",
        });
    }
}
exports.PrismaUnknownError = PrismaUnknownError;
