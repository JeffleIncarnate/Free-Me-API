"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = void 0;
const pool_1 = require("./pool");
async function createTables() {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
		uuid text PRIMARY KEY NOT NULL,
	    username text NOT NULL,
	    firstname text NOT NULL,
	    lastname text NOT NULL,
	    dateOfbirth text not null,
	    address text not null,
	    "password" text NOT NULL,
	    email text NOT NULL,
	    phonenumber text NOT NULL,
	    type text NOT NULL,
	    nzbn bigint not null,
	    gst bigint not null,
	    socials jsonb not null
    );
  `;
    const verifyUsers = `
    CREATE TABLE IF NOT EXISTS verifyUsers (
	    uuid text PRIMARY KEY NOT NULL,
	    username text NOT NULL,
	    firstname text NOT NULL,
	    lastname text NOT NULL,
	    dateOfbirth text not null,
	    address text not null,
	    "password" text NOT NULL,
	    email text NOT NULL,
	    phonenumber text NOT NULL,
	    type text NOT NULL,
	    nzbn bigint not null,
	    gst bigint not null,
	    socials jsonb not null
    );
  `;
    const jobsTables = `
	CREATE TABLE public.jobs (
		posterid text NULL,
		title text NULL,
		description text NULL,
		place text NULL,
		companyname varchar NULL,
		postid bigint primary key NULL,
		posttime bigint NULL
	);
  `;
    try {
        await pool_1.pool.query(query);
        await pool_1.pool.query(verifyUsers);
        await pool_1.pool.query(jobsTables);
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.createTables = createTables;
