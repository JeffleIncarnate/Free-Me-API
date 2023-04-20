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

router.post("/confirmStatementOfWork", async (req: Request, res: Response) => {
  let uuidOfStatementOfWork = req.body.uuid;
});

module.exports = router;
