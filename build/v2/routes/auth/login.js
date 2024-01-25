"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const zod_express_middleware_1 = require("zod-express-middleware");
const argon2_1 = require("../../core/argon2/argon2");
const errors_1 = __importDefault(require("../../core/errors"));
const prisma_1 = require("../../core/prisma/prisma");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("../../core/jwt/jwt");
const crypto_1 = require("crypto");
exports.login = express_1.default.Router();
exports.login.post("/", (0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
}), async (req, res, next) => {
    let user;
    try {
        user = await prisma_1.pool.user.findUnique({
            where: {
                email: req.body.email,
            },
            select: {
                role: true,
                id: true,
                password: true,
            },
        });
    }
    catch (err) {
        if (err instanceof library_1.PrismaClientKnownRequestError ||
            err instanceof library_1.PrismaClientValidationError) {
            next(new errors_1.default.PrismaErr(err.message));
            return;
        }
        throw err;
    }
    if (user === null) {
        next(new errors_1.default.YouDoNotExist());
        return;
    }
    if (!(await (0, argon2_1.verifyPassword)(user.password, req.body.password))) {
        next(new errors_1.default.IncorrectPassword());
        return;
    }
    // generate token
    const accessToken = (0, jwt_1.createAccessToken)(user.role, user.id);
    const refreshTokenId = (0, crypto_1.randomUUID)();
    const refreshToken = (0, jwt_1.createRefreshToken)(user.id, refreshTokenId);
    // insert into refresh token database
    await prisma_1.pool.refreshToken.create({
        data: {
            id: refreshTokenId,
        },
    });
    return res.send({
        success: true,
        accessToken,
        refreshToken,
    });
});
