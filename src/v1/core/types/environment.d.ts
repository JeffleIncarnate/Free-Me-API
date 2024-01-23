declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;

      USER_PG: string;
      HOST: string;
      DATABASE: string;
      PASSWORD: string;
      POSTGRES_PORT: string;
    }
  }
}

export {};
