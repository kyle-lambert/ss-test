import invariant from "tiny-invariant";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { compare, hash } from "bcryptjs";

import type { Password, User } from "@prisma/client";

import { sessionStorage } from "@/lib/services/session.server";
import { prisma } from "@/lib/services/db.server";
import { type AuthenticateLoginContext } from "@/lib/utils/validation";

export const FORM_STRATEGY = "FORM_STRATEGY" as const;

export async function hashPassword(password: string) {
  return await hash(password, 10);
}
export async function comparePassword(
  password: string,
  hash: Password["hash"]
) {
  return await compare(password, hash);
}

const formStrategy = new FormStrategy(async ({ context }) => {
  const {
    formData: { email, password },
  } = (context as AuthenticateLoginContext) ?? {};

  invariant(email, "Missing email in FormStrategy");
  invariant(password, "Missing password in FormStrategy");

  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    throw new AuthorizationError("404");
  }

  const isMatch = await comparePassword(
    password,
    userWithPassword.password.hash
  );

  if (!isMatch) {
    throw new AuthorizationError("401");
  }

  return userWithPassword.id;
});

export const authenticator = new Authenticator<User["id"]>(sessionStorage, {
  throwOnError: true,
});

authenticator.use(formStrategy, FORM_STRATEGY);
