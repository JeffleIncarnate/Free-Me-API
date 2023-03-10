import { pool } from "./pool";

export async function createTables(): Promise<any> {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
	    uuid text PRIMARY KEY NOT NULL,
	    username text NOT NULL,
	    firstname text NOT NULL,
	    lastname text NOT NULL,
	    "password" text NOT NULL,
	    email text NOT NULL,
  	  phonenumber text NOT NULL,
      type text NOT NULL
    );
  `;

  try {
    pool.query(query);
  } catch (err: any) {
    return false;
  }

  return true;
}
