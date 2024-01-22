import jwt from "jsonwebtoken";

/**
 * Creates a token with jwt and 64 random bytes :)))
 * @param user Not the hashed password
 * @return Returns a token
 */
export function createToken(user: any): any {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

/**
 * Decrypt a JWT token so you can use the values
 * @param token jwt token
 * @returns a dictionary of the values in the token
 */
export function decryptToken(token: any): any {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
}
