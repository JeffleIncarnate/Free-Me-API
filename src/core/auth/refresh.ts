import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import crypto from "crypto";

import HTTPErrors from "../errors";
import { pool } from "../prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createAccessToken, createRefreshToken } from "../jwt/jwt";

export const refresh = express.Router();

interface RefreshTokenData {
  id: string;
  refreshId: string;
  iat: number;
  exp: number;
}

refresh.post(
  "/",
  validateRequest({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),
  async (req, res, next) => {
    let refreshTokenData: RefreshTokenData;

    try {
      refreshTokenData = jwt.verify(
        req.body.refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as RefreshTokenData;
    } catch (err) {
      if (!(err instanceof JsonWebTokenError)) {
        next(new HTTPErrors.GeneralTokenFail());
        return;
      }

      next(new HTTPErrors.InvalidTokenProvided(err.message));
      return;
    }

    try {
      await pool.refreshToken.delete({
        where: {
          id: refreshTokenData.refreshId,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        next(new HTTPErrors.RefreshTokenNotFound());
        return;
      }

      next(new HTTPErrors.PrismaUnknownError());
      return;
    }

    const userId = refreshTokenData.id;

    const user = await pool.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      throw new Error(
        "Some fucking guy come in here with a token AND DOES NOT EVEN exist in the database, FUCK YOU"
      );
    }

    const accessToken = createAccessToken(user.role, userId);

    const refreshTokenId = crypto.randomUUID();
    const refreshToken = createRefreshToken(userId, refreshTokenId);

    await pool.refreshToken.create({
      data: {
        id: refreshTokenId,
      },
    });

    return res.send({
      success: true,
      accessToken,
      refreshToken,
    });
  }
);
