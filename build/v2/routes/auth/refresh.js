"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const zod_express_middleware_1 = require("zod-express-middleware");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const errors_1 = __importDefault(require("../../core/errors"));
const prisma_1 = require("../../core/prisma/prisma");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("../../core/jwt/jwt");
exports.refresh = express_1.default.Router();
exports.refresh.post("/", (0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string(),
    }),
}), async (req, res, next) => {
    let refreshTokenData;
    try {
        refreshTokenData = jsonwebtoken_1.default.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        if (!(err instanceof jsonwebtoken_1.JsonWebTokenError)) {
            next(new errors_1.default.GeneralTokenFail());
            return;
        }
        next(new errors_1.default.InvalidTokenProvided(err.message));
        return;
    }
    try {
        await prisma_1.pool.refreshToken.delete({
            where: {
                id: refreshTokenData.refreshId,
            },
        });
    }
    catch (err) {
        if (err instanceof library_1.PrismaClientKnownRequestError &&
            err.code === "P2025") {
            next(new errors_1.default.RefreshTokenNotFound());
            return;
        }
        next(new errors_1.default.PrismaUnknownError());
        return;
    }
    const userId = refreshTokenData.id;
    const user = await prisma_1.pool.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
        },
    });
    if (!user) {
        throw new Error("Some fucking guy come in here with a token AND DOES NOT EVEN exist in the database, FUCK YOU");
    }
    const accessToken = (0, jwt_1.createAccessToken)(user.role, userId);
    const refreshTokenId = crypto_1.default.randomUUID();
    const refreshToken = (0, jwt_1.createRefreshToken)(userId, refreshTokenId);
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
