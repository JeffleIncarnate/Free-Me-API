import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../.env" });

import { verifyArray } from "../verifyArray/verifyArray";
import { verifyHash } from "../argon2/argon2";
import { pool } from "../database/pool";
import { createToken } from "../jwt/jwt";
import { AccessTokenUser } from "../data/types";

let router = express.Router();

router.use(express.json());

router.post("/login", async (req: Request, res: Response) => {
  let arrOfItems = [req.body.username, req.body.password];

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  let sqlRes;

  let query = {
    text: "SELECT password, uuid FROM public.users WHERE username=$1",
    values: [arrOfItems[0]],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (!(await verifyHash(sqlRes.rows[0].password, arrOfItems[1])))
    return res.status(401).send({ detail: "Incorrect password" });

  let user: AccessTokenUser = {
    uuid: sqlRes.rows[0].uuid,
    scopes: {
      getSelf: true,
      mofifySelf: true,
      deleteSelf: true,
      getOtherUsers: false,
      createUsers: false,
      deleteUsers: false,
      updateUsers: false,
    },
  };

  let token = createToken(user);

  return res.send({ accessToken: token, expiresIn: "15m" });
});

module.exports = router;
