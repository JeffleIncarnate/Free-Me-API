import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: Secret;
      REFRESH_TOKEN_SECRET: string;
      DATABASE_URL: string; // Prisma only but in case I every wanna do something with it
    }
  }
}

export {};
