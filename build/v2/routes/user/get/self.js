"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.self = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../core/auth/auth");
const prisma_1 = require("../../../core/prisma/prisma");
exports.self = express_1.default.Router();
exports.self.get("/", auth_1.authorizeRequest, async (req, res, next) => {
    if (!req.user) {
        return next(new Error("THE SAME FUCKING GUY CAME IN HERE WITH AN ALTERED TOKEN. FUCK OFF"));
    }
    const user = await prisma_1.pool.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            type: true,
        },
    });
    if (user === null) {
        return next(new Error("AGAIN WITH THE FAKE FUCKING TOKEN. I WILL IP BAN YO ASS"));
    }
    if (user.type === "CLIENT") {
        const profile = await prisma_1.pool.user.findUnique({
            where: {
                id: req.user.id,
            },
            include: {
                clientProfile: true,
            },
        });
        if (profile === null) {
            return next(new Error("Bro, go away"));
        }
        return res.send({
            success: true,
            profile: {
                ...profile,
                nzbn: profile.nzbn.toString(),
                gst: profile.gst.toString(),
            },
            status: 200,
        });
    }
    const profile = await prisma_1.pool.user.findUnique({
        where: {
            id: req.user.id,
        },
        include: {
            consultantProfile: true,
        },
    });
    if (profile === null) {
        return next(new Error("Bro, go away"));
    }
    return res.send({
        success: true,
        profile: {
            ...profile,
            nzbn: profile.nzbn.toString(),
            gst: profile.gst.toString(),
        },
        status: 200,
    });
});
