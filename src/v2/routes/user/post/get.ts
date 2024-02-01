import express from "express";

import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authorizeRequest } from "../../../core/auth/auth";
import { pool } from "../../../core/prisma/prisma";

export const getPost = express.Router();

getPost.get(
  "/:authorId",
  authorizeRequest,
  validateRequest({
    params: z.object({
      authorId: z.string().uuid(),
    }),
  }),
  async (req, res, next) => {
    const user = await pool.user.findUnique({
      where: {
        id: req.params.authorId,
      },
      select: {
        profilePicture: true,
        firstname: true,
        lastname: true,
      },
    });

    if (user === null) {
      return res.status(404).send({
        success: false,
        status: 404,
      });
    }

    return res.send({
      success: true,
      user,
      status: 200,
    });
  }
);
