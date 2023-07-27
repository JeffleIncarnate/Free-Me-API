"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config({ path: "../../.env" });
function authToken(req, res, next) {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null)
        return res.sendStatus(401);
    // Verify the token
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ result: "Forbidden" });
        req.user = user;
        next();
    });
}
exports.authToken = authToken;
//# sourceMappingURL=auth.js.map