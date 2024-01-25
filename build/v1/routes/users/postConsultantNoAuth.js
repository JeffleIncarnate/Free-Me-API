"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const pool_1 = require("../../core/database/pool");
const argon2_1 = require("../../core/argon2/argon2");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const images_1 = require("../../core/data/images");
const router = express_1.default.Router();
router.post("/postConsultantNoAuth", (0, express_fileupload_1.default)(), async (req, res) => {
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
    if (req.body.type !== "consultant")
        return res.send({
            detail: `Can not accept type: ${req.body.type}`,
            details: {
                provided: req.body.type,
                required: "consultant",
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
        profile: {
            awards: req.body.awards
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            skills: req.body.skills
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            values: req.body.values
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            hobbies: req.body.hobbies
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            ambitions: req.body.ambitions
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            cvHighlights: req.body.cvHighlights
                .split(",")
                .map((item) => item.trim().replace(/"/g, "")),
            timeline: JSON.parse(req.body.timeline),
            education: JSON.parse(req.body.education),
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
module.exports = router;
