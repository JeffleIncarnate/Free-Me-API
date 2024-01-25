"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_1 = require("../../core/database/pool");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const router = express_1.default.Router();
router.post("/verifyUserFromVerifyTable", async (req, res) => {
    let arrOfItems = [req.body.uuid, req.body.verified];
    let sqlRes;
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.send({ detail: "Provide all items" });
    let uuid = req.body.uuid;
    let verified = req.body.verified;
    if (!verified)
        return res
            .status(400)
            .send({ detail: "You can not verify it the verify is false" });
    let query = {
        text: "SELECT * FROM public.verifyUsers WHERE uuid=$1",
        values: [uuid],
    };
    try {
        sqlRes = await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res
            .status(400)
            .send({ detail: "That user that you wanted to verify does not exist" });
    query = {
        text: "DELETE FROM public.verifyUsers WHERE uuid=$1",
        values: [uuid],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    query = {
        text: "INSERT INTO public.users (uuid, username, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);",
        values: [
            sqlRes.rows[0].uuid,
            sqlRes.rows[0].username,
            sqlRes.rows[0].firstname,
            sqlRes.rows[0].lastname,
            sqlRes.rows[0].dateofbirth,
            sqlRes.rows[0].address,
            sqlRes.rows[0].password,
            sqlRes.rows[0].email,
            sqlRes.rows[0].phonenumber,
            sqlRes.rows[0].type,
            sqlRes.rows[0].nzbn,
            sqlRes.rows[0].gst,
            sqlRes.rows[0].socials,
        ],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.status(201).send({ detail: "User verified" });
});
module.exports = router;
