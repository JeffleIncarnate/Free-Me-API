"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../core/auth/auth");
const prisma_1 = require("../../../core/prisma/prisma");
exports.allUsers = express_1.default.Router();
exports.allUsers.get("/", auth_1.authorizeRequest, (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.sendStatus(401);
    }
    next();
}, async (req, res, next) => res.send((await prisma_1.pool.user.findMany()).map((user) => {
    const tmp = { ...user };
    tmp.gst = tmp.gst.toString();
    tmp.nzbn = tmp.nzbn.toString();
    return tmp;
})));
