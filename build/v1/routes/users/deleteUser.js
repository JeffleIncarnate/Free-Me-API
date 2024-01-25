"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_1 = require("../../core/database/pool");
const deleteUser = express_1.default.Router();
deleteUser.delete("/deleteUser", async (req, res) => {
    const query = {
        text: "DELETE FROM public.users WHERE email=$1",
        values: [req.query.email],
    };
    try {
        await pool_1.pool.query(query);
        return res.send({ detail: "User deleted" });
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
});
module.exports = deleteUser;
