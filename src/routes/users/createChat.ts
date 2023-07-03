import express, { Request, Response } from "express";
require("dotenv").config({ path: `${__dirname}/../../.env` });

import { pool } from "../../core/database/pool";
import { hashPassword } from "../../core/argon2/argon2";
import { User, CreateUser, VerifyEmail } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { createToken } from "../../core/jwt/jwt";
import { decryptToken } from "../../core/jwt/jwt";

const router = express.Router();

router.post("/createChat", async (req: Request, res: Response) => {
    let arrOfItems = [
        req.body.client,
        req.body.consultant,
        req.body.,
    ]
    
    if ()
});

router.post("/addChatMessage", async (req: Request, res: Response) => {});
