"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAccessToken(role, id) {
    return jsonwebtoken_1.default.sign({
        role,
        id,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
    });
}
exports.createAccessToken = createAccessToken;
function createRefreshToken(id, refreshId) {
    return jsonwebtoken_1.default.sign({
        id,
        refreshId,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}
exports.createRefreshToken = createRefreshToken;
