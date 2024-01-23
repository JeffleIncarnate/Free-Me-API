import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { logger } from "./v2/core/logger/logger";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes -- Auth
const loginv1 = require("./v1/core/auth/login");

// Rouths -- User
const getUserData = require("./v1/routes/users/getUserData");
const createUser = require("./v1/routes/users/createUser");
const jobOpportunities = require("./v1/routes/users/jobOpportunities");
const verifyUserFromVerifyTable = require("./v1/routes/users/verifyUserFromVerifyTable");
const updateUser = require("./v1/routes/users/updateUser");
const deleteUser = require("./v1/routes/users/deleteUser");

const postConsultantNoAuth = require("./v1/routes/users/postConsultantNoAuth");
const postClientNoAuth = require("./v1/routes/users/postClientNoAuth");
const postFreeriderNoAuth = require("./v1/routes/users/postFreeriderNoAuth");

// Routes -- SOW
const sow = require("./v1/routes/statementOfWork/statementOfWork");

// Use Routes -- Auth
app.use("/freeme/auth", loginv1);

// Use Routes -- User
app.use("/freeme", getUserData);
app.use("/freeme", createUser);
app.use("/freeme", jobOpportunities);
app.use("/freeme", verifyUserFromVerifyTable);
app.use("/freeme", updateUser);
app.use("/freeme", deleteUser);

app.use("/freeme", postConsultantNoAuth);
app.use("/freeme", postClientNoAuth);
app.use("/freeme", postFreeriderNoAuth);

// Use Routes -- SOW
app.use("/freeme", sow);

// v2 API
// auth
import { login } from "./v2/routes/auth/login";
import { refresh } from "./v2/routes/auth/refresh";

// user
import { userPost } from "./v2/routes/user/create";
import { allUsers } from "./v2/routes/user/get/all";
import { self } from "./v2/routes/user/get/self";

app.use("/v2/api/auth/login", login);
app.use("/v2/api/auth/refresh", refresh);

app.use("/v1/api/user", userPost);
app.use("/v1/api/user", allUsers);
app.use("/v1/api/user/self", self);

app.get("/", async (req, res) => {
  return res.sendStatus(200);
});

// fallback
app.all("*", async (req, res) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

app.listen(3000, () => {
  logger.info("API running on port 3000");
});
