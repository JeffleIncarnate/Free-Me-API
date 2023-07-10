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
const crypto_1 = __importDefault(require("crypto"));
var email = require("../../../node_modules/emailjs/email");
require("dotenv").config({ path: `${__dirname}/../../.env` });
const pool_1 = require("../../core/database/pool");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const router = express_1.default.Router();
router.post("/createStatementOfWork", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let arrOfItems = [
        req.body.clientEmail,
        req.body.consultantEmail,
        req.body.tasks,
        req.body.timeline,
        req.body.name,
        req.body.description,
    ];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems))
        return res.status(400).send({ detail: "Provide all items" });
    let statementOfWork = {
        name: req.body.name,
        description: req.body.description,
        uuid: crypto_1.default.randomUUID(),
        client: arrOfItems[0],
        consultant: arrOfItems[1],
        tasks: arrOfItems[2],
        timeline: arrOfItems[3],
        agreed: JSON.parse(JSON.stringify({
            client: true,
            consultant: false,
        })),
    };
    // get the users uuids from their emails
    let sqlRes;
    let query = {
        text: "SELECT uuid, type FROM public.users WHERE email=$1",
        values: [statementOfWork.client],
    };
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "This client does not exist." });
    if (sqlRes.rows[0].type !== "client") {
        return res
            .status(400)
            .send({ detail: "The client you chose is not a client." });
    }
    statementOfWork.client = sqlRes.rows[0].uuid;
    query = {
        text: "SELECT uuid, type FROM public.users WHERE email=$1",
        values: [statementOfWork.consultant],
    };
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "This consultant does not exist." });
    if (sqlRes.rows[0].type !== "consultant") {
        return res
            .status(400)
            .send({ detail: "The consultant you chose is not a consultant." });
    }
    statementOfWork.consultant = sqlRes.rows[0].uuid;
    query = {
        text: "INSERT INTO public.statementofwork (uuid, client, consultant, tasks, timeline, name, description, agreed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        values: [
            statementOfWork.uuid,
            statementOfWork.client,
            statementOfWork.consultant,
            JSON.stringify(statementOfWork.tasks),
            JSON.stringify(statementOfWork.timeline),
            statementOfWork.name,
            statementOfWork.description,
            JSON.stringify(statementOfWork.agreed),
        ],
    };
    try {
        yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send({ detail: "Statement of work created" });
}));
router.post("/updateStatementOfWork", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uuidOfStatementOfWork = req.body.uuid;
}));
router.get("/getSpecificStatementOfWork", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uuid = req.query.uuid;
    let query = {
        text: "SELECT type FROM public.users WHERE uuid=$1",
        values: [uuid],
    };
    let sqlRes;
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "This user does not exist" });
    let type = sqlRes.rows[0].type;
    query = {
        text: `SELECT * FROM public.statementofwork WHERE ${type}=$1`,
        values: [uuid],
    };
    try {
        sqlRes = yield pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send(sqlRes.rows);
}));
module.exports = router;
//# sourceMappingURL=statementOfWork.js.map