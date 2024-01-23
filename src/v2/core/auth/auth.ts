import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import HttpErrors from "../errors";

interface TokenPayload {
  role: "GENERAL" | "ADMIN";
  id: string;
  iat: number;
  exp: number;
}

export function authorizeRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"

  if (token === null || token === undefined) return res.sendStatus(401);

  let tokenData: TokenPayload;

  try {
    tokenData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;
  } catch (err) {
    if (!(err instanceof jwt.JsonWebTokenError)) {
      next(new HttpErrors.GeneralTokenFail());
      return;
    }

    next(new HttpErrors.InvalidTokenProvided(err.message));
    return;
  }

  req.user = {
    id: tokenData.id,
    role: tokenData.role,
  };

  next();
}
