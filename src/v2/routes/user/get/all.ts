import express from "express";

import { authorizeRequest } from "../../../core/auth/auth";
import { pool } from "../../../core/prisma/prisma";

export const allUsers = express.Router();

allUsers.get(
  "/",
  authorizeRequest,
  (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
      return res.sendStatus(401);
    }

    next();
  },
  async (req, res, next) =>
    res.send(
      (await pool.user.findMany()).map((user) => {
        const tmp: any = { ...user };

        tmp.gst = tmp.gst.toString();
        tmp.nzbn = tmp.nzbn.toString();

        return tmp;
      })
    )
);
