import express, { Request, Response, Application } from "express";
import chalk from "chalk";

import { createTables } from "./core/database/tables";
import { testConnecton } from "./core/database/pool";

const app: Application = express();
let port = 3000;
const log = console.log;
chalk.level = 1;

app.use(express.json());

// Rouths -- User
const getUserData = require("./routes/users/getUserData");
const createUser = require("./routes/users/createUser");

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
  log(chalk.blue("Connection secure"), chalk.green("✓"));

  await createTables();
  log(chalk.blue("Tables Created"), chalk.green("✓"));

  app.listen(port, () => {
    log(chalk.blue(`Listening on port ${port}`));
  });
}

(async () => {
  await startUp();
})();
