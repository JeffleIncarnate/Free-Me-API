import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";

const router = express.Router();

router.delete("/deleteUser", async (req: Request, res: Response) => {
  const query = {
    text: "DELETE FROM public.users WHERE email=$1",
    values: [req.query.email],
  };

  try {
    await pool.query(query);
    return res.send({ detail: "User deleted" });
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }
});

module.exports = router;
