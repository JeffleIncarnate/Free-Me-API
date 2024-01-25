"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../core/auth/auth");
const prisma_1 = require("../../../core/prisma/prisma");
const errors_1 = __importDefault(require("../../../core/errors"));
exports.deleteUser = express_1.default.Router();
exports.deleteUser.delete("/", auth_1.authorizeRequest, async (req, res, next) => {
    if (!req.user) {
        return next(new Error("THE SAME FUCKING GUY CAME IN HERE WITH AN ALTERED TOKEN. FUCK OFF"));
    }
    console.log(req.user.id);
    try {
        await prisma_1.pool.user.delete({
            where: {
                id: req.user.id,
            },
        });
    }
    catch (err) {
        console.log(err);
        next(new errors_1.default.PrismaUnknownError());
        return;
    }
    return res.status(200).send({
        success: true,
        status: 200,
    });
});
