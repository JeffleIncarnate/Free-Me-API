"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const cors_1 = __importDefault(require("cors"));
// import { createTables } from "./core/database/tables";
const pool_1 = require("./core/database/pool");
const argon2_1 = require("./core/argon2/argon2");
const app = (0, express_1.default)();
let port = 3000;
const log = console.log;
chalk_1.default.level = 1;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes -- Auth
const login = require("./core/auth/login");
// Rouths -- User
const getUserData = require("./routes/users/getUserData");
const createUser = require("./routes/users/createUser");
const jobOpportunities = require("./routes/users/jobOpportunities");
const verifyUserFromVerifyTable = require("./routes/users/verifyUserFromVerifyTable");
const updateUser = require("./routes/users/updateUser");
const deleteUser = require("./routes/users/deleteUser");
const postConsultantNoAuth = require("./routes/users/postConsultantNoAuth");
const postClientNoAuth = require("./routes/users/postClientNoAuth");
const postFreeriderNoAuth = require("./routes/users/postFreeriderNoAuth");
// Routes -- SOW
const sow = require("./routes/statementOfWork/statementOfWork");
// Use Routes -- Auth
app.use("/freeme/auth", login);
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
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({ detail: "Welcome to the Free me API" });
}));
// fallback
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({
        detail: "This endpoint does not exist.",
        endpoint: { detail: `'${req.url}' does not exist.` },
    });
}));
function startUp() {
    return __awaiter(this, void 0, void 0, function* () {
        // performs all nessesary checks before starting
        yield (0, pool_1.testConnecton)();
        log(chalk_1.default.blue("Connection Secure"), chalk_1.default.green("✓"));
        // await createTables();
        // log(chalk.blue("Tables Created"), chalk.green("✓"));
        let hash = yield (0, argon2_1.hashPassword)("test");
        (yield (0, argon2_1.verifyHash)(hash, "test"))
            ? log(chalk_1.default.blue("Hash Secure"), chalk_1.default.green("✓"))
            : log(chalk_1.default.red("Hash not secure"), chalk_1.default.red("X"));
        app.listen(port, () => {
            log(chalk_1.default.blue(`Listening on port ${port}`));
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startUp();
}))();
//# sourceMappingURL=index.js.map