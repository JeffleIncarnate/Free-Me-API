import express, { Request, Response } from "express";
import crypto from "crypto";
import fileUpload from "express-fileupload";
require("dotenv").config({ path: `${__dirname}/../../.env` });

import { pool } from "../../core/database/pool";
import { hashPassword } from "../../core/argon2/argon2";
import { User, CreateUser, VerifyEmail } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { createToken } from "../../core/jwt/jwt";
import { decryptToken } from "../../core/jwt/jwt";
import {
  defaultProfileBackground,
  defaultProfilePicture,
} from "../../core/data/images";

const router = express.Router();

router.post(
  "/postConsultantNoAuth",
  fileUpload(),
  async (req: Request | any, res: Response) => {
    let banner;
    let profilePicture;

    // Checking to make sure the files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    profilePicture =
      req.files.profilePicture !== undefined
        ? req.files.profilePicture.data.toString("base64")
        : defaultProfilePicture;

    banner =
      req.files.banner !== undefined
        ? req.files.banner.data.toString("base64")
        : defaultProfileBackground;

    if (req.body.type !== "consultant")
      return res.send({
        detail: `Can not accept type: ${req.body.type}`,
        details: {
          provided: req.body.type,
          required: "consultant",
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
    ];

    if (!verifyArray(arrOfItems))
      return res.send({ detail: "Provide all items" });

    const user = {
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
      profile: {
        awards: req.body.awards
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        skills: req.body.skills
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        values: req.body.values
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        hobbies: req.body.hobbies
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        ambitions: req.body.ambitions
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        cvHighlights: req.body.cvHighlights
          .split(",")
          .map((item: string) => item.trim().replace(/"/g, "")),
        timeline: JSON.parse(req.body.timeline),
        education: JSON.parse(req.body.education),
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
      text: "INSERT INTO public.users (uuid, firstname, lastname, dateOfBirth, address, password, email, phonenumber, type, nzbn, gst, socials, profile, profilePicture, banner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);",
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
        profilePicture,
        banner,
      ],
    };
    try {
      await pool.query(query);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }
    return res.status(201).send({ detail: "Successfuly created user" });
  }
);

module.exports = router;
