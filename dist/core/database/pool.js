"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnecton = exports.pool = void 0;
const { Pool } = require("pg");
require("dotenv").config({ path: `${__dirname}/../../.env` });
// Connection string
const user = process.env.USER_PG;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.POSTGRES_PORT;
// Creating the pool:
exports.pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
});
function testConnecton() {
    try {
        exports.pool.query("SELECT NOW()");
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.testConnecton = testConnecton;
//# sourceMappingURL=pool.js.map