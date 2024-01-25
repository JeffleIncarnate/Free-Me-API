"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
async function hashPassword(password) {
    return await argon2_1.default.hash(password);
}
exports.hashPassword = hashPassword;
async function verifyPassword(hashPassword, password) {
    return await argon2_1.default.verify(hashPassword, password);
}
exports.verifyPassword = verifyPassword;
