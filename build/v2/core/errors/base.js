"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError {
    status;
    message;
    constructor(status, details) {
        const message = {
            success: false,
            details,
            status,
        };
        this.message = message;
        this.status = status;
    }
}
exports.HTTPError = HTTPError;
