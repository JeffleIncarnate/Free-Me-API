import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { CreatePost } from "../../core/data/types";

const router = express.Router();

router.get("/getAllJobs", async (req: Request, res: Response) => {
  const query = "SELECT * FROM public.jobs";

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.send(sqlRes.rows);
});

router.post("/createJob", async (req: Request, res: Response) => {
  let arrOfItems = [
    req.body.uuid,
    req.body.title,
    req.body.description,
    req.body.place,
    req.body.company,
  ];

  if (!verifyArray(arrOfItems))
    return res.send({ detail: "Provide all items" });

  let query = {
    text: "SELECT * FROM public.users WHERE uuid=$1",
    values: [arrOfItems[0]],
  };

  let sqlRes;

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  //   if (sqlRes.rowCount === 0)
  //     return res.send({
  //       detail: "You can not create a post as you do not exist",
  //     });

  let getRandomInt = (max: number) => Math.floor(Math.random() * max);

  let postId = getRandomInt(100000000);

  query = {
    text: "SELECT * FROM public.jobs WHERE postid=$1",
    values: [postId],
  };

  for (;;) {
    let sqlRes = await pool.query(query);

    if (sqlRes.rowCount === 0) break;

    if (sqlRes.rows[0].postid !== postId) break;
  }

  let post: CreatePost = {
    postId: postId,
    posterId: req.body.uuid,
    title: req.body.title,
    description: req.body.description,
    place: req.body.place,
    company: req.body.company,
    time: Date.now(),
  };

  query = {
    text: "INSERT INTO public.jobs (posterid, title, description, place, companyname, postid, posttime) VALUES ($1, $2, $3, $4, $5, $6, $7);",
    values: [
      post.posterId,
      post.title,
      post.description,
      post.place,
      post.company,
      post.postId,
      post.time,
    ],
  };

  try {
    sqlRes = await pool.query(query);
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  return res.status(201).send({ detail: "Post created" });
});

module.exports = router;
