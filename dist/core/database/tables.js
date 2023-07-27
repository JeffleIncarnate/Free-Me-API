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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = void 0;
const pool_1 = require("./pool");
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield pool_1.pool.query(query);
            yield pool_1.pool.query(verifyUsers);
            yield pool_1.pool.query(jobsTables);
        }
        catch (err) {
            return false;
        }
        return true;
    });
}
exports.createTables = createTables;
//# sourceMappingURL=tables.js.map