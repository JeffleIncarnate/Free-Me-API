import { Request, Response, NextFunction } from "express";

import { HTTPError } from "./base";

export function errorHandler(
  err: object,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(err instanceof HTTPError)) {
    return next();
  }

  const statusCode = err.status || 500;
  return res.status(statusCode).send(err.message);
}
