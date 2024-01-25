"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const pool_1 = require("../../core/database/pool");
const verifyArray_1 = require("../../core/verifyArray/verifyArray");
const router = express_1.default.Router();
router.post("/createStatementOfWork", async (req, res) => {
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
            client: false,
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
        sqlRes = await pool_1.pool.query(query);
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
        sqlRes = await pool_1.pool.query(query);
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
        text: "INSERT INTO public.statementofwork (uuid, client, consultant, tasks, timeline, name, description, agreed, clientemail, consultantemail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        values: [
            statementOfWork.uuid,
            statementOfWork.client,
            statementOfWork.consultant,
            JSON.stringify(statementOfWork.tasks),
            JSON.stringify(statementOfWork.timeline),
            statementOfWork.name,
            statementOfWork.description,
            JSON.stringify(statementOfWork.agreed),
            req.body.clientEmail,
            req.body.consultantEmail,
        ],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send({ detail: "Statement of work created" });
});
router.post("/updateSowTasks", async (req, res) => {
    let uuidOfStatementOfWork = req.body.uuid;
    let tasks = req.body.tasks;
    let timeline = req.body.timeline;
    let arrOfItems = [uuidOfStatementOfWork, timeline, tasks];
    if (!(0, verifyArray_1.verifyArray)(arrOfItems)) {
        return res.status(400).send({ detail: "Provide all items" });
    }
    let query = {
        text: `UPDATE public.statementofwork SET tasks=$1,timeline=$2 WHERE uuid=$3`,
        values: [
            JSON.stringify(tasks),
            JSON.stringify(timeline),
            uuidOfStatementOfWork,
        ],
    };
    try {
        await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send({ detail: "Successfully updated statement of work" });
});
router.get("/getSpecificStatementOfWork", async (req, res) => {
    let uuid = req.query.uuid;
    let query = {
        text: "SELECT type FROM public.users WHERE uuid=$1",
        values: [uuid],
    };
    let sqlRes;
    try {
        sqlRes = await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    if (sqlRes.rowCount === 0)
        return res.status(400).send({ detail: "This user does not exist" });
    let type = sqlRes.rows[0].type;
    if (type === "freerider") {
        type = "consultant";
    }
    query = {
        text: `SELECT * FROM public.statementofwork WHERE ${type}=$1`,
        values: [uuid],
    };
    try {
        sqlRes = await pool_1.pool.query(query);
    }
    catch (err) {
        return res.status(500).send({ detail: err.stack });
    }
    return res.send(sqlRes.rows);
});
module.exports = router;
