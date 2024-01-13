import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { verifyPassword } from "../argon2/argon2";
import HttpError from "../errors";
import { pool } from "../prisma/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { createAccessToken, createRefreshToken } from "../jwt/jwt";

export const login = express.Router();

login.post(
  "/",
  validateRequest({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  }),
  async (req, res, next) => {
    let user;

    try {
      user = await pool.user.findUnique({
        where: {
          email: req.body.email,
        },
        select: {
          role: true,
          id: true,
          password: true,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientValidationError
      ) {
        next(new HttpError.PrismaErr(err.message));
        return;
      }

      throw err;
    }

    if (user === null) {
      next(new HttpError.YouDoNotExist());
      return;
    }

    if (!(await verifyPassword(user.password, req.body.password))) {
      next(new HttpError.IncorrectPassword());
      return;
    }

    // generate token
    const accessToken = createAccessToken(user.role, user.id);
    const refreshToken = createRefreshToken(user.id);

    // insert into refresh token database
    await pool.refreshToken.create({
      data: {
        token: refreshToken,
      },
    });

    return res.send({
      success: true,
      accessToken,
      refreshToken,
    });
  }
);
