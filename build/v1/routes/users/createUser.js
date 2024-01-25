"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
var email = require("../../../../node_modules/emailjs/email.js");
const pool_1 = require("../../core/database/pool");
const argon2_1 = require("../../core/argon2/argon2");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const jwt_1 = require("../../core/jwt/jwt");
const jwt_2 = require("../../core/jwt/jwt");
const images_1 = require("../../core/data/images");
const createUser = express_1.default.Router();
createUser.post("/createUserNoAuth", (0, express_fileupload_1.default)(), async (req, res) => {
    let banner;
    let profilePicture;
    // Checking to make sure the files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }
    profilePicture =
        req.files.profilePicture !== undefined
            ? req.files.profilePicture.data.toString("base64")
            : images_1.defaultProfilePicture;
    banner =
        req.files.banner !== undefined
            ? req.files.banner.data.toString("base64")
            : images_1.defaultProfileBackground;
    if (req.body.type !== "consultant" &&
        req.body.type !== "client" &&
        req.body.type !== "freerider")
        return res.send({
            detail: `Can not accept type: ${req.body.type}`,
            details: {
                provided: req.body.type,
                required: "consultant, client or freerider",
            },
        });
    const arrOfItems = [
        req.body.firstname,
        req.body.lastname,
        req.body.password,
        req.body.email,
        req.body.phonenumber,
        req.body.type,
        req.body.dateOfBirth,
        req.body.address,
        req.body.nzbn,
        req.body.gst,
        req.body.profile,
    ];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.send({ detail: "Provide all items" });
    const user = {
        uuid: crypto_1.default.randomUUID(),
        firstname: req.body.firstname.toLowerCase(),
        lastname: req.body.lastname.toLowerCase(),
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        email: req.body.email,
        password: await (0, argon2_1.hashPassword)(req.body.password),
        phonenumber: req.body.phonenumber,
        type: req.body.type,
        nzbn: req.body.nzbn,
        gst: req.body.gst,
        socials: {
            facebook: req.body.facebook,
            linkedIn: req.body.linkedIn,
        },
        scopes: {
            getSelf: true,
            mofifySelf: true,
            deleteSelf: true,
            getOtherUsers: false,
            createUsers: false,
            deleteUsers: false,
            updateUsers: false,
        },
        profile: req.body.profile,
    };
    let query = {
        text: "SELECT * FROM public.users WHERE uuid=$1",
        values: [user.uuid],
    };
    for (;;) {
        let sqlRes = await pool_1.pool.query(query);
        if (sqlRes.rowCount === 0)
            break;
        if (sqlRes.rows[0].uuid !== user.uuid)
            break;
    }
    query = {
        text: "INSERT INTO public.users (uuid, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials, profile, profilePicture, banner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);",
        values: [
            user.uuid,
            user.firstname,
            user.lastname,
            user.dateOfBirth,
            user.address,
            user.password,
            user.email,
            user.phonenumber,
            user.type,
            user.nzbn,
            user.gst,
            user.socials,
            user.profile,
            profilePicture,
            banner,
        ],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.status(201).send({ detail: "Successfuly created user" });
});
createUser.post("/createUserVerifyEmail", async (req, res) => {
    if (req.body.type !== "consultant" &&
        req.body.type !== "client" &&
        req.body.type !== "freerider")
        return res.send({
            detail: `Can not accept type: ${req.body.type}`,
            details: {
                provided: req.body.type,
                required: "consultant, client or freerider",
            },
        });
    const arrOfItems = [
        req.body.username,
        req.body.firstname,
        req.body.lastname,
        req.body.password,
        req.body.email,
        req.body.phonenumber,
        req.body.type,
        req.body.dateOfBirth,
        req.body.address,
        req.body.nzbn,
        req.body.gst,
        req.body.type,
    ];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.send({ detail: "Provide all items" });
    const user = {
        uuid: crypto_1.default.randomUUID(),
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        email: req.body.email,
        password: await (0, argon2_1.hashPassword)(req.body.password),
        phonenumber: req.body.phonenumber,
        type: req.body.type,
        nzbn: req.body.nzbn,
        gst: req.body.gst,
        socials: {
            facebook: req.body.facebook ?? null,
            linkedIn: req.body.linkedIn ?? null,
        },
        scopes: {
            getSelf: false,
            mofifySelf: false,
            deleteSelf: false,
            getOtherUsers: false,
            createUsers: false,
            deleteUsers: false,
            updateUsers: false,
        },
    };
    let query = {
        text: "SELECT * FROM public.users WHERE uuid=$1",
        values: [user.uuid],
    };
    for (;;) {
        let sqlRes = await pool_1.pool.query(query);
        if (sqlRes.rowCount === 0)
            break;
        if (sqlRes.rows[0].uuid !== user.uuid)
            break;
    }
    let token = (0, jwt_1.createToken)(user);
    var server = email.server.connect({
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: "smtp.gmail.com",
        ssl: true,
    });
    server.send({
        text: token,
        from: "dhruvbanking01@gmail.com",
        to: user.email,
        subject: "Verify Email",
    }, (err, message) => {
        if (err)
            console.log(err);
    });
    return res.send({ detail: "Successfully sent email" });
});
createUser.post("/createUserFromToken", async (req, res) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
    if (token === null)
        return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified
    let payload;
    try {
        payload = (0, jwt_2.decryptToken)(token);
    }
    catch (err) {
        return res.send({ detail: err });
    }
    let user = {
        uuid: payload.uuid,
        username: payload.username,
        firstname: payload.firstname,
        lastname: payload.lastname,
        dateOfBirth: payload.dateOfBirth,
        address: payload.address,
        email: payload.email,
        password: payload.password,
        phonenumber: payload.phonenumber,
        type: payload.type,
        nzbn: payload.nzbn,
        gst: payload.gst,
        socials: {
            facebook: payload.socials.facebook,
            linkedIn: payload.socials.linkedIn,
        },
        scopes: {
            getSelf: true,
            mofifySelf: true,
            deleteSelf: true,
            getOtherUsers: false,
            createUsers: false,
            deleteUsers: false,
            updateUsers: false,
        },
    };
    let query = {
        text: "INSERT INTO public.verifyUsers (uuid, username, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);",
        values: [
            user.uuid,
            user.username,
            user.firstname,
            user.lastname,
            user.dateOfBirth,
            user.address,
            user.password,
            user.email,
            user.phonenumber,
            user.type,
            user.nzbn,
            user.gst,
            user.socials,
        ],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.status(201).send({
        detail: "Success!",
        details: {
            account: "Your account will be reviewed, this should take 2-3 business days",
        },
    });
});
module.exports = createUser;
