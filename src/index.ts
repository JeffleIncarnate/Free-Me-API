import "dotenv/config";

import express, { NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

import { logger } from "./core/logger/logger";
import { errorHandler } from "./core/errors/handler";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
// Auth
import { login } from "./core/auth/login";
import { refresh } from "./core/auth/refresh";

// User
import { userPost } from "./routes/user/create/create";
import { self } from "./routes/user/get/self";
import { allUsers } from "./routes/user/get/all";

// Use Routes
// Auth
app.use("/v1/api/auth/login", login);
app.use("/v1/api/auth/refresh", refresh);

app.use("/v1/api/user", userPost);
app.use("/v1/api/user", allUsers);
app.use("/v1/api/user/self", self);

app.get("/", async (req, res) => {
  return res.sendStatus(200);
});

app.use(errorHandler);

app.listen(3000, () => {
  logger.info("API running on port 3000");
});
