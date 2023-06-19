import { Link, useActionData } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";
import { unauthorized } from "remix-utils";
import { validationError } from "remix-validated-form";

import isArray from "lodash/isArray";

import { getSession, commitSession } from "@/lib/services/session.server";
import { FORM_STRATEGY, authenticator } from "@/lib/services/auth.server";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

import {
  type AuthenticateLoginContext,
  loginValidator,
} from "@/lib/utils/validation";
import type { ResponseJSON } from "@/lib/utils/http";
import { cn } from "@/lib/utils/cn";

import { UserLoginForm } from "./user-login-form";

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.clone().formData());

  const result = await loginValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  try {
    const userId = await authenticator.authenticate(FORM_STRATEGY, request, {
      context: { formData: result.data } as AuthenticateLoginContext,
    });

    const session = await getSession(request.headers.get("Cookie"));
    session.set(authenticator.sessionKey, userId);

    const headers = {
      "Set-Cookie": await commitSession(session),
    };

    return redirect("/app", { headers });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      if (error.message === "401" || error.message === "404") {
        return unauthorized<ResponseJSON>({
          errors: [
            {
              name: "Authorisation error",
              description:
                "Opps! It looks like you've entered some invalid credentials. Please try again with a valid email and password.",
            },
          ],
        });
      }
    }

    throw error;
  }
}

export default function () {
  const { errors } = useActionData<ResponseJSON>() || {};

  return (
    <div className="container relative flex h-full flex-col items-center justify-center lg:px-0">
      <Link
        to="/register"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Register
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Account sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to sign in to an existing account
            </p>
          </div>

          <UserLoginForm validator={loginValidator} />

          {isArray(errors) &&
            errors.map((error, idx) => {
              return (
                <Alert key={idx} variant="destructive">
                  <AlertTitle>{error.name}</AlertTitle>
                  <AlertDescription>{error.description}</AlertDescription>
                </Alert>
              );
            })}
        </div>
      </div>
    </div>
  );
}
