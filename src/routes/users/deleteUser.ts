import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";

const router = express.Router();

router.get("/deleteUser", async (req: Request, res: Response) => {
  const query = {
    text: "SELECT * FROM public.users WHERE uuid=$1",
    values: [req.query.uuid],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sqlRes.rowCount === 0)
    return res.status(400).send({ detail: "User does not exist" });

  return res.send(sqlRes.rows[0]);
});

module.exports = router;
