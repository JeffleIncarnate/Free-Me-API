import express, { Request, Response, Application } from "express";
import chalk from "chalk";
import cors from "cors";

// import { createTables } from "./core/database/tables";
import { testConnecton } from "./core/database/pool";
import { hashPassword, verifyHash } from "./core/argon2/argon2";

const app: Application = express();
let port = 3000;
const log = console.log;
chalk.level = 1;

app.use(express.json());
app.use(cors());

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

app.get("/", async (req: Request, res: Response) => {
  return res.send({ detail: "Welcome to the Free me API" });
});

// fallback
app.all("*", async (req: Request, res: Response) => {
  return res.send({
    detail: "This endpoint does not exist.",
    endpoint: { detail: `'${req.url}' does not exist.` },
  });
});

async function startUp() {
  // performs all nessesary checks before starting
  await testConnecton();
  log(chalk.blue("Connection Secure"), chalk.green("✓"));

  // await createTables();
  // log(chalk.blue("Tables Created"), chalk.green("✓"));

  let hash = await hashPassword("test");
  (await verifyHash(hash, "test"))
    ? log(chalk.blue("Hash Secure"), chalk.green("✓"))
    : log(chalk.red("Hash not secure"), chalk.red("X"));

  app.listen(port, () => {
    log(chalk.blue(`Listening on port ${port}`));
  });
}

(async () => {
  await startUp();
})();

//
