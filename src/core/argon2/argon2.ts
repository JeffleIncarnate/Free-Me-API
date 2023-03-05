import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, { hashLength: 50 });
}

export async function verifyHash(
  hash: string,
  plain: string
): Promise<boolean> {
  return await argon2.verify(hash, plain);
}
