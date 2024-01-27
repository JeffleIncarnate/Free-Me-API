import express, { Request, Response, NextFunction } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import crypto from "crypto";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { pool } from "../../../core/prisma/prisma";
import { background, pfp } from "../../../core/data/images";
import { hashPassword } from "../../../core/argon2/argon2";
import HttpError from "../../../core/errors";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const userPost = express.Router();

userPost.post(
  "/",
  fileUpload(),
  validateRequest({
    body: z.object({
      firstname: z.string(),
      lastname: z.string(),
      password: z.string(),
      email: z.string().email(),
      phonenumber: z.string(),
      type: z.enum(["client", "consultant", "freerider"]),
      dateOfBirth: z.string(),
      address: z.string(),
      nzbn: z.string().regex(new RegExp(/^[0-9]*$/g)),
      gst: z.string().regex(new RegExp(/^[0-9]*$/g)),
      location: z.string(),
      description: z.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = {
      firstname: (req.body.firstname as string).toLowerCase(),
      lastname: (req.body.lastname as string).toLowerCase(),
      password: await hashPassword(req.body.password),
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      type: req.body.type,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      nzbn: req.body.nzbn,
      gst: req.body.gst,
      location: (req.body.location as string).toLowerCase(),
      pfp: "",
      banner: "",
      description: req.body.description,
    };

    user.pfp = setPfp(req.files);
    user.banner = setBackground(req.files);

    try {
      if (user.type === "client") {
        await pool.user.create({
          data: {
            id: crypto.randomUUID(),
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
            email: user.email,
            phonenumber: user.phonenumber,
            type: "CLIENT",
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            nzbn: user.nzbn,
            gst: user.gst,
            role: "GENERAL",
            profilePicture: user.pfp,
            banner: user.banner,
            followers: [],
            following: [],
            connections: [],
            clientProfile: {
              create: {
                description: user.description,
                location: user.location,
                website: "",
                ambitions: [],
                awards: [],
                values: [],
                timeline: {},
                socialMedia: {},
              },
            },
          },
        });
      } else {
        await pool.user.create({
          data: {
            id: crypto.randomUUID(),
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
            email: user.email,
            phonenumber: user.phonenumber,
            type: user.type === "consultant" ? "CONSULTANT" : "FREERIDER",
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            nzbn: user.nzbn,
            gst: user.gst,
            role: "GENERAL",
            profilePicture: user.pfp,
            banner: user.banner,
            followers: [],
            following: [],
            connections: [],
            consultantProfile: {
              create: {
                description: user.description,
                location: user.location,
                tier: "BRONZE",
                values: [],
                skills: [],
                education: [],
                ambitions: [],
                awards: [],
                hobbies: [],
                timeline: {},
              },
            },
          },
        });
      }
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientValidationError
      ) {
        next(new HttpError.PrismaErr(err.message));
        return;
      }

      throw err;
    }

    return res.status(201).send({
      success: true,
      status: 201,
    });
  }
);

function setPfp(req: fileUpload.FileArray | null | undefined): string {
  if (req === null || req === undefined) {
    return pfp;
  }

  if (req.pfp === undefined) {
    return pfp;
  }

  return ((req.pfp as UploadedFile).data as Buffer).toString("base64");
}

function setBackground(req: fileUpload.FileArray | null | undefined): string {
  if (req === null || req === undefined) {
    return background;
  }

  if (req.banner === undefined) {
    return background;
  }

  return ((req.banner as UploadedFile).data as Buffer).toString("base64");
}
