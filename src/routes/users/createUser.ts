import express, { Request, Response } from "express";
import crypto from "crypto";

import { pool } from "../../core/database/pool";
import { hashPassword } from "../../core/argon2/argon2";
import { User } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";

const router = express.Router();

router.post("/createUserNoAuth", async (req: Request, res: Response) => {
  if (req.body.type !== "consultant" && req.body.type !== "client")
    return res.send({
      detail: `Can not accept type: ${req.body.type}`,
      details: {
        provided: req.body.type,
        required: "consultant or client",
      },
    });

  const arrOfItems = [
    req.body.username,
    req.body.firstname,
    req.body.lastname,
    req.body.password,
    req.body.email,
    req.body.phonenumber,
    req.body.type,
  ];

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  const user: User = {
    uuid: crypto.randomUUID(),
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    phonenumber: req.body.phonenumber,
    type: req.body.type,
    scopes: {
      getSelf: true,
      mofifySelf: true,
      deleteSelf: true,
      getOtherUsers: false,
      create_users: false,
      delete_users: false,
      update_users: false,
    },
  };

  let query: any = {
    text: "SELECT * FROM public.users WHERE uuid=$1",
    values: [user.uuid],
  };

  for (;;) {
    let sqlRes = await pool.query(query);

    if (sqlRes.rowCount === 0) break;

    if (sqlRes.rows[0].uuid !== user.uuid) break;
  }

  query = {
    text: "INSERT INTO public.users (uuid, username, firstname, lastname, password, email, phonenumber, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8);",
    values: [
      user.uuid,
      user.username,
      user.firstname,
      user.lastname,
      user.password,
      user.email,
      user.phonenumber,
      user.type,
    ],
  };

  try {
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.status(201).send({ detail: "Successfuly created user" });
});

module.exports = router;
