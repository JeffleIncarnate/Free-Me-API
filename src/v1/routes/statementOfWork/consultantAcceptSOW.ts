import express, { Request, Response } from "express";

const router = express.Router();

router.post("/confirmStatementOfWork", async (req: Request, res: Response) => {
  let uuidOfStatementOfWork = req.body.uuid;
});

module.exports = router;
