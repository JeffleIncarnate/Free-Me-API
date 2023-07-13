import express, { Request, Response } from "express";
import crypto, { createPublicKey } from "crypto";
var email = require("../../../node_modules/emailjs/email");
require("dotenv").config({ path: `${__dirname}/../../.env` });

import { pool } from "../../core/database/pool";
import { IStatementOfWork } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { createToken } from "../../core/jwt/jwt";
import { decryptToken } from "../../core/jwt/jwt";

const router = express.Router();

router.post("/createStatementOfWork", async (req: Request, res: Response) => {
  let arrOfItems = [
    req.body.clientEmail,
    req.body.consultantEmail,
    req.body.tasks,
    req.body.timeline,
    req.body.name,
    req.body.description,
  ];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  let statementOfWork: IStatementOfWork = {
    name: req.body.name,
    description: req.body.description,
    uuid: crypto.randomUUID(),
    client: arrOfItems[0],
    consultant: arrOfItems[1],
    tasks: arrOfItems[2],
    timeline: arrOfItems[3],
    agreed: JSON.parse(
      JSON.stringify({
        client: true,
        consultant: false,
      })
    ),
  };

  // get the users uuids from their emails
  let sqlRes;

  let query: any = {
    text: "SELECT uuid, type FROM public.users WHERE email=$1",
    values: [statementOfWork.client],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
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
    sqlRes = await pool.query(query);
  } catch (err: any) {
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
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.send({ detail: "Statement of work created" });
});

router.post("/updateStatementOfWork", async (req: Request, res: Response) => {
  let uuidOfStatementOfWork = req.body.uuid;
});

router.get(
  "/getSpecificStatementOfWork",
  async (req: Request, res: Response) => {
    let uuid = req.query.uuid;

    let query: any = {
      text: "SELECT type FROM public.users WHERE uuid=$1",
      values: [uuid],
    };

    let sqlRes;

    try {
      sqlRes = await pool.query(query);
    } catch (err: any) {
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
      sqlRes = await pool.query(query);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return res.send(sqlRes.rows);
  }
);

module.exports = router;
