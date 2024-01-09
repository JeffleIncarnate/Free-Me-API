import express from "express";
import morgan from "morgan";

import { logger } from "./core/logger/logger";

const app = express();

app.use(morgan("dev"));

app.get("/", async (req, res) => {
  return res.sendStatus(200);
});

app.get("/elo", async (req, res, next) => {
  next("e");
});

app.listen(3000, () => {
  logger.info("API running on port 3000");
});
