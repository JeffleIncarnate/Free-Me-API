"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config({ path: "../../.env" });
/**
 * Creates a token with jwt and 64 random bytes :)))
 * @param user Not the hashed password
 * @return Returns a token
 */
function createToken(user) {
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}
exports.createToken = createToken;
/**
 * Decrypt a JWT token so you can use the values
 * @param token jwt token
 * @returns a dictionary of the values in the token
 */
function decryptToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
exports.decryptToken = decryptToken;
//# sourceMappingURL=jwt.js.map