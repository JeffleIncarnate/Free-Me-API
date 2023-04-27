import express, { Request, Response } from "express";
import crypto from "crypto";
var email = require("../../../node_modules/emailjs/email");
require("dotenv").config({ path: `${__dirname}/../../.env` });

import { pool } from "../../core/database/pool";
import { hashPassword } from "../../core/argon2/argon2";
import { User, CreateUser, VerifyEmail } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { createToken } from "../../core/jwt/jwt";
import { decryptToken } from "../../core/jwt/jwt";

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
    req.body.firstname,
    req.body.lastname,
    req.body.password,
    req.body.email,
    req.body.phonenumber,
    req.body.type,
    req.body.dateOfBirth,
    req.body.address,
    req.body.nzbn,
    req.body.gst,
    req.body.type,
    req.body.profile,
  ];

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  const user: CreateUser = {
    uuid: crypto.randomUUID(),
    firstname: req.body.firstname.toLowerCase(),
    lastname: req.body.lastname.toLowerCase(),
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    phonenumber: req.body.phonenumber,
    type: req.body.type,
    nzbn: req.body.nzbn,
    gst: req.body.gst,
    socials: {
      facebook: req.body.facebook,
      linkedIn: req.body.linkedIn,
    },
    scopes: {
      getSelf: true,
      mofifySelf: true,
      deleteSelf: true,
      getOtherUsers: false,
      createUsers: false,
      deleteUsers: false,
      updateUsers: false,
    },
    profile: req.body.profile,
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
    text: "INSERT INTO public.users (uuid, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials, profile) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);",
    values: [
      user.uuid,
      user.firstname,
      user.lastname,
      user.dateOfBirth,
      user.address,
      user.password,
      user.email,
      user.phonenumber,
      user.type,
      user.nzbn,
      user.gst,
      user.socials,
      user.profile,
    ],
  };

  try {
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.status(201).send({ detail: "Successfuly created user" });
});

router.post("/createUserVerifyEmail", async (req: Request, res: Response) => {
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
    req.body.dateOfBirth,
    req.body.address,
    req.body.nzbn,
    req.body.gst,
    req.body.type,
  ];

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  const user: VerifyEmail = {
    uuid: crypto.randomUUID(),
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    phonenumber: req.body.phonenumber,
    type: req.body.type,
    nzbn: req.body.nzbn,
    gst: req.body.gst,
    socials: {
      facebook: req.body.facebook ?? null,
      linkedIn: req.body.linkedIn ?? null,
    },
    scopes: {
      getSelf: false,
      mofifySelf: false,
      deleteSelf: false,
      getOtherUsers: false,
      createUsers: false,
      deleteUsers: false,
      updateUsers: false,
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

  let token = createToken(user);

  var server = email.server.connect({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: "smtp.gmail.com",
    ssl: true,
  });

  server.send(
    {
      text: token,
      from: "dhruvbanking01@gmail.com",
      to: user.email,
      subject: "Verify Email",
    },
    (err: any, message: any) => {
      if (err) console.log(err);
    }
  );

  return res.send({ detail: "Successfully sent email" });
});

router.post("/createUserFromToken", async (req: Request, res: Response) => {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  let payload;

  try {
    payload = decryptToken(token!);
  } catch (err: any) {
    return res.send({ detail: err });
  }

  let user: User = {
    uuid: payload.uuid,
    username: payload.username,
    firstname: payload.firstname,
    lastname: payload.lastname,
    dateOfBirth: payload.dateOfBirth,
    address: payload.address,
    email: payload.email,
    password: payload.password,
    phonenumber: payload.phonenumber,
    type: payload.type,
    nzbn: payload.nzbn,
    gst: payload.gst,
    socials: {
      facebook: payload.socials.facebook,
      linkedIn: payload.socials.linkedIn,
    },
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

  let query = {
    text: "INSERT INTO public.verifyUsers (uuid, username, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);",
    values: [
      user.uuid,
      user.username,
      user.firstname,
      user.lastname,
      user.dateOfBirth,
      user.address,
      user.password,
      user.email,
      user.phonenumber,
      user.type,
      user.nzbn,
      user.gst,
      user.socials,
    ],
  };

  try {
    await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.status(201).send({
    detail: "Success!",
    details: {
      account:
        "Your account will be reviewed, this should take 2-3 business days",
    },
  });
});

module.exports = router;
