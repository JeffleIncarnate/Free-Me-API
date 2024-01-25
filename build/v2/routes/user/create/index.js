"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPost = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const zod_express_middleware_1 = require("zod-express-middleware");
const prisma_1 = require("../../../core/prisma/prisma");
const images_1 = require("../../../core/data/images");
const argon2_1 = require("../../../core/argon2/argon2");
const errors_1 = __importDefault(require("../../../core/errors"));
const library_1 = require("@prisma/client/runtime/library");
exports.userPost = express_1.default.Router();
exports.userPost.post("/", (0, express_fileupload_1.default)(), (0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        firstname: zod_1.z.string(),
        lastname: zod_1.z.string(),
        password: zod_1.z.string(),
        email: zod_1.z.string().email(),
        phonenumber: zod_1.z.string(),
        type: zod_1.z.enum(["client", "consultant", "freerider"]),
        dateOfBirth: zod_1.z.string(),
        address: zod_1.z.string(),
        nzbn: zod_1.z.string().regex(new RegExp(/^[0-9]*$/g)),
        gst: zod_1.z.string().regex(new RegExp(/^[0-9]*$/g)),
        location: zod_1.z.string(),
        description: zod_1.z.string(),
    }),
}), async (req, res, next) => {
    const user = {
        firstname: req.body.firstname.toLowerCase(),
        lastname: req.body.lastname.toLowerCase(),
        password: await (0, argon2_1.hashPassword)(req.body.password),
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        type: req.body.type,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        nzbn: req.body.nzbn,
        gst: req.body.gst,
        location: req.body.location.toLowerCase(),
        pfp: "",
        background: "",
        description: req.body.description,
    };
    user.pfp = setPfp(req.files);
    user.background = setBackground(req.files);
    try {
        if (user.type === "client") {
            await prisma_1.pool.user.create({
                data: {
                    id: crypto_1.default.randomUUID(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    password: user.password,
                    email: user.email,
                    phonenumber: user.phonenumber,
                    type: "CLIENT",
                    dateOfBirth: user.dateOfBirth,
                    address: user.address,
                    nzbn: user.nzbn,
                    gst: user.gst,
                    role: "GENERAL",
                    profilePicture: user.pfp,
                    background: user.background,
                    followers: [],
                    following: [],
                    connections: [],
                    clientProfile: {
                        create: {
                            description: user.description,
                            location: user.location,
                            website: "",
                            ambitions: [],
                            awards: [],
                            values: [],
                            timeline: {},
                            socialMedia: {},
                        },
                    },
                },
            });
        }
        else {
            await prisma_1.pool.user.create({
                data: {
                    id: crypto_1.default.randomUUID(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    password: user.password,
                    email: user.email,
                    phonenumber: user.phonenumber,
                    type: user.type === "consultant" ? "CONSULTANT" : "FREERIDER",
                    dateOfBirth: user.dateOfBirth,
                    address: user.address,
                    nzbn: user.nzbn,
                    gst: user.gst,
                    role: "GENERAL",
                    profilePicture: user.pfp,
                    background: user.background,
                    followers: [],
                    following: [],
                    connections: [],
                    consultantProfile: {
                        create: {
                            description: user.description,
                            location: user.location,
                            tier: "BRONZE",
                            values: [],
                            skills: [],
                            education: [],
                            ambitions: [],
                            awards: [],
                            hobbies: [],
                            timeline: {},
                        },
                    },
                },
            });
        }
    }
    catch (err) {
        if (err instanceof library_1.PrismaClientKnownRequestError ||
            err instanceof library_1.PrismaClientValidationError) {
            next(new errors_1.default.PrismaErr(err.message));
            return;
        }
        throw err;
    }
    return res.status(201).send({
        success: true,
        status: 201,
    });
});
function setPfp(req) {
    if (req === null || req === undefined) {
        return images_1.pfp;
    }
    if (req.pfp === undefined) {
        return images_1.pfp;
    }
    return req.pfp.data.toString("base64");
}
function setBackground(req) {
    if (req === null || req === undefined) {
        return images_1.background;
    }
    if (req.background === undefined) {
        return images_1.background;
    }
    return req.background.data.toString("base64");
}
