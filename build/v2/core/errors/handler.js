"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const base_1 = require("./base");
function errorHandler(err, req, res, next) {
    if (!(err instanceof base_1.HTTPError)) {
        return next(err);
    }
    const statusCode = err.status || 500;
    return res.status(statusCode).send(err.message);
}
exports.errorHandler = errorHandler;
