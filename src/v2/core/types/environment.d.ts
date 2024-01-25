declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      DATABASE_URL: string; // Prisma only but in case I every wanna do something with it
    }
  }

  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};
