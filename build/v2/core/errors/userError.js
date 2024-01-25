"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUsername = void 0;
const base_1 = require("./base");
class InvalidUsername extends base_1.HTTPError {
    constructor() {
        super(400, {
            reason: "The username provided is not valid. Username can not contain spaces or special characters",
        });
    }
}
exports.InvalidUsername = InvalidUsername;
