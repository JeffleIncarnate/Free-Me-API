import express, { Request, Response } from "express";
require("dotenv").config({ path: `${__dirname}/../../.env` });

import { pool } from "../../core/database/pool";
import { hashPassword } from "../../core/argon2/argon2";
import { UpdateUser } from "../../core/data/types";
import { verifyArray } from "../../core/verifyArray/verifyArray";

const router = express.Router();

let updateUser = async (
  uuid: string,
  col: string,
  dataTo: string
): Promise<boolean | any> => {
  let query = {
    text: "SUSSY MAONG HSHAHFGDAKJFHIWRYFL",
    values: ["ASMFOIAEG"],
  };

  if (col === "username") {
    query["text"] = "UPDATE users SET username=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "firstname") {
    query["text"] = "UPDATE users SET firstname=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "lastname") {
    query["text"] = "UPDATE users SET lastname=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "address") {
    query["text"] = "UPDATE users SET address=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "password") {
    query["text"] = "UPDATE users SET password=$1 WHERE uuid=$2";
    query["values"] = [await hashPassword(dataTo), uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "email") {
    query["text"] = "UPDATE users SET email=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "phonenumber") {
    query["text"] = "UPDATE users SET phonenumber=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "nzbn") {
    query["text"] = "UPDATE users SET nzbn=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else if (col === "gst") {
    query["text"] = "UPDATE users SET gst=$1 WHERE uuid=$2";
    query["values"] = [dataTo, uuid];

    try {
      await pool.query(query);
      return true;
    } catch (err: any) {
      return false;
    }
  } else {
    return false;
  }
};

router.put("/updateUser", async (req: Request, res: Response) => {
  let arrOfItems = [req.query.uuid, req.body.col, req.body.dataTo];

  let user: UpdateUser = {
    uuid: arrOfItems[0],
    col: arrOfItems[1],
    dataTo: arrOfItems[2],
  };

  if (!verifyArray(arrOfItems))
    return res.status(400).send({ detail: "Provide all items" });

  if (
    req.body.col !== "username" &&
    req.body.col !== "firstname" &&
    req.body.col !== "lastname" &&
    req.body.col !== "address" &&
    req.body.col !== "password" &&
    req.body.col !== "email" &&
    req.body.col !== "phonenumber" &&
    req.body.col !== "nzbn" &&
    req.body.col !== "gst"
  )
    return res
      .status(400)
      .send({ detail: "Can not change column if it does not exist" });

  let query = {
    text: "SELECT * FROM users WHERE uuid=$1",
    values: [user.uuid],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(400).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0)
    return res.status(400).send({ detail: "User does not exist." });

  let response: boolean = await updateUser(user.uuid, user.col, user.dataTo);

  if (!response) return res.status(400).send({ detail: "Unknown error" });
});

module.exports = router;
