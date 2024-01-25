"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = __importDefault(require("../errors"));
function authorizeRequest(req, res, next) {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null || token === undefined)
        return res.sendStatus(401);
    let tokenData;
    try {
        tokenData = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        if (!(err instanceof jsonwebtoken_1.default.JsonWebTokenError)) {
            next(new errors_1.default.GeneralTokenFail());
            return;
        }
        next(new errors_1.default.InvalidTokenProvided(err.message));
        return;
    }
    req.user = {
        id: tokenData.id,
        role: tokenData.role,
    };
    next();
}
exports.authorizeRequest = authorizeRequest;
