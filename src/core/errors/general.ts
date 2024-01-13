import { HTTPError } from "./base";

export class PrismaErr extends HTTPError {
  constructor(prismaErr: string) {
    super(500, {
      reason: "Some error occurred while updating database",
      err: prismaErr,
    });
  }
}
