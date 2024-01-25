"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_1 = require("../../core/database/pool");
const router = express_1.default.Router();
router.get("/getAllUsers", async (req, res) => {
    const query = "SELECT * FROM public.users";
    let sqlRes;
    try {
        sqlRes = await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send(sqlRes.rows);
});
router.get("/getUser", async (req, res) => {
    const query = {
        text: "SELECT * FROM public.users WHERE email=$1",
        values: [req.query.email],
    };
    let sqlRes;
    try {
        sqlRes = await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "User does not exist" });
    return res.send(sqlRes.rows[0]);
});
module.exports = router;
