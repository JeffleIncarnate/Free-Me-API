"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHash = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
async function hashPassword(password) {
    return await argon2_1.default.hash(password, { hashLength: 50 });
}
exports.hashPassword = hashPassword;
async function verifyHash(hash, plain) {
    return await argon2_1.default.verify(hash, plain);
}
exports.verifyHash = verifyHash;
