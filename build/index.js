"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./v2/core/logger/logger");
const handler_1 = require("./v2/core/errors/handler");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes -- Auth
const loginv1 = require("./v1/core/auth/login");
// Rouths -- User
const getUserData = require("./v1/routes/users/getUserData");
const createUser = require("./v1/routes/users/createUser");
const jobOpportunities = require("./v1/routes/users/jobOpportunities");
const verifyUserFromVerifyTable = require("./v1/routes/users/verifyUserFromVerifyTable");
const updateUser = require("./v1/routes/users/updateUser");
const deleteUserv1 = require("./v1/routes/users/deleteUser");
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
app.use("/freeme", deleteUserv1);
app.use("/freeme", postConsultantNoAuth);
app.use("/freeme", postClientNoAuth);
app.use("/freeme", postFreeriderNoAuth);
// Use Routes -- SOW
app.use("/freeme", sow);
// v2 API
// auth
const login_1 = require("./v2/routes/auth/login");
const refresh_1 = require("./v2/routes/auth/refresh");
// user
const create_1 = require("./v2/routes/user/create");
const all_1 = require("./v2/routes/user/get/all");
const self_1 = require("./v2/routes/user/get/self");
const delete_1 = require("./v2/routes/user/delete");
app.use("/v2/api/auth/login", login_1.login);
app.use("/v2/api/auth/refresh", refresh_1.refresh);
app.use("/v2/api/user", create_1.userPost);
app.use("/v2/api/user", all_1.allUsers);
app.use("/v2/api/user/self", self_1.self);
app.use("/v2/api/user/self", delete_1.deleteUser);
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
app.use(handler_1.errorHandler);
app.listen(3000, () => {
    logger_1.logger.info("API running on port 3000");
});
