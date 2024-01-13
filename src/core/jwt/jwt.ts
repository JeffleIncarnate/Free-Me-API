import jwt from "jsonwebtoken";

export function createAccessToken(role: string, id: string): string {
  return jwt.sign(
    {
      role,
      id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
}

export function createRefreshToken(id: string) {
  return jwt.sign(
    {
      id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
}
