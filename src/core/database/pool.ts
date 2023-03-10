const { Pool } = require("pg");
import { PoolClient } from "pg";
require("dotenv").config({ path: `${__dirname}/../../.env` });

// Connection string
const user = process.env.USER_PG;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.POSTGRES_PORT;

// Creating the pool:
export const pool: PoolClient = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});
