import express, { Request, Response, Application } from "express";
import chalk from "chalk";

import { createTables } from "./core/database/tables";
import { testConnecton } from "./core/database/pool";
import { hashPassword, verifyHash } from "./core/argon2/argon2";

const app: Application = express();
let port = 3000;
const log = console.log;
chalk.level = 1;

app.use(express.json());

// Routes -- Auth
const login = require("./core/auth/login");

// Rouths -- User
const getUserData = require("./routes/users/getUserData");
const createUser = require("./routes/users/createUser");

// Use Routes -- Auth
app.use("/freeme/auth", login);

// Use Routes -- User
app.use("/freeme", getUserData);
app.use("/freeme", createUser);

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

  await createTables();
  log(chalk.blue("Tables Created"), chalk.green("✓"));

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
