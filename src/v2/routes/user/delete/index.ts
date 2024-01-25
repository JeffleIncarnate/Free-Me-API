import express from "express";

import { authorizeRequest } from "../../../core/auth/auth";
import { pool } from "../../../core/prisma/prisma";
import HttpErrors from "../../../core/errors";

export const deleteUser = express.Router();

deleteUser.delete("/", authorizeRequest, async (req, res, next) => {
  if (!req.user) {
    return next(
      new Error(
        "THE SAME FUCKING GUY CAME IN HERE WITH AN ALTERED TOKEN. FUCK OFF"
      )
    );
  }

  console.log(req.user.id);

  try {
    await pool.user.delete({
      where: {
        id: req.user.id,
      },
    });
  } catch (err) {
    console.log(err);
    next(new HttpErrors.PrismaUnknownError());
    return;
  }

  return res.status(200).send({
    success: true,
    status: 200,
  });
});
