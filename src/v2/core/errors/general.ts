import { HTTPError } from "./base";

export class PrismaErr extends HTTPError {
  constructor(prismaErr: string) {
    super(500, {
      reason: "Some error occurred while updating database",
      err: prismaErr,
    });
  }
}

export class PrismaUnknownError extends HTTPError {
  constructor() {
    super(500, {
      reason: "Unknown database error",
    });
  }
}
