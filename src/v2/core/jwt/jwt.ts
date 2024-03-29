import jwt from "jsonwebtoken";

export function createAccessToken(role: string, id: string): string {
  return jwt.sign(
    {
      role,
      id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "2h",
    }
  );
}

export function createRefreshToken(id: string, refreshId: string): string {
  return jwt.sign(
    {
      id,
      refreshId,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
}
