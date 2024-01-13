import { HTTPError } from "./base";

export class PrismaErr extends HTTPError {
  constructor(prismaErr: string) {
    super(400, {
      reason: prismaErr,
    });
  }
}
