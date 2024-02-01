import express from "express";

import { authorizeRequest } from "../../../core/auth/auth";
import { pool } from "../../../core/prisma/prisma";

export const self = express.Router();

self.get("/", authorizeRequest, async (req, res, next) => {
  if (!req.user) {
    return next(
      new Error(
        "THE SAME FUCKING GUY CAME IN HERE WITH AN ALTERED TOKEN. FUCK OFF"
      )
    );
  }

  const user = await pool.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      type: true,
    },
  });

  if (user === null) {
    return next(
      new Error("AGAIN WITH THE FAKE FUCKING TOKEN. I WILL IP BAN YO ASS")
    );
  }

  if (user.type === "CLIENT") {
    const profile = await pool.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        clientProfile: true,
        post: true,
      },
    });

    if (profile === null) {
      return next(new Error("Bro, go away"));
    }

    return res.send({
      success: true,
      profile: {
        ...profile,
        nzbn: profile.nzbn.toString(),
        gst: profile.gst.toString(),
      },
      status: 200,
    });
  }

  const profile = await pool.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      consultantProfile: true,
      post: true,
    },
  });

  if (profile === null) {
    return next(new Error("Bro, go away"));
  }

  return res.send({
    success: true,
    profile: {
      ...profile,
      nzbn: profile.nzbn.toString(),
      gst: profile.gst.toString(),
    },
    status: 200,
  });
});
