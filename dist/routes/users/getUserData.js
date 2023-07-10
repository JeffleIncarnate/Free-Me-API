"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_1 = require("../../core/database/pool");
const router = express_1.default.Router();
router.get("/getAllUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM public.users";
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send(sqlRes.rows);
}));
router.get("/getUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: "SELECT * FROM public.users WHERE email=$1",
        values: [req.query.email],
    };
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "User does not exist" });
    return res.send(sqlRes.rows[0]);
}));
module.exports = router;
//# sourceMappingURL=getUserData.js.map