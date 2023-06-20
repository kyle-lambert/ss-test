import type { User } from "@prisma/client";
import { prisma } from "../services/db.server";

export async function findUserByEmail({ email }: Pick<User, "email">) {
  const result = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return result;
}

export async function checkExistingUser({ email }: Pick<User, "email">) {
  const isExistingUser = await findUserByEmail({ email });
  return isExistingUser ? true : false;
}
