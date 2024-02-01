import express from "express";

import { authorizeRequest } from "../../../core/auth/auth";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import fileUpload, { UploadedFile } from "express-fileupload";
import { pool } from "../../../core/prisma/prisma";

export const createPost = express.Router();

createPost.post(
  "/",
  authorizeRequest,
  fileUpload(),
  validateRequest({
    body: z.object({
      text: z.string(),
    }),
  }),
  async (req, res, next) => {
    if (!req.user) {
      return next(
        new Error(
          "THE SAME FUCKING GUY CAME IN HERE WITH AN ALTERED TOKEN. FUCK OFF"
        )
      );
    }

    const medias = setMedia(req.files);

    await pool.post.create({
      data: {
        postText: req.body.text,
        likes: [] as string[],
        postImages: medias,
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    return res.status(201).send({
      success: true,
      status: 201,
    });
  }
);

function setMedia(req: fileUpload.FileArray | null | undefined): string[] {
  if (req === null || req === undefined) {
    return ["", "", "", ""];
  }

  const allMedias: string[] = [];

  for (let i = 1; i <= 4; i++) {
    const item = `media${i}`;

    if (req[item] === undefined) {
      allMedias.push("");
      continue;
    }

    allMedias.push(
      ((req[item] as UploadedFile).data as Buffer).toString("base64")
    );
  }

  return allMedias;
}
