import { Link, useActionData } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import Stripe from "stripe";
import invariant from "tiny-invariant";
import { isArray } from "lodash";
import { validationError } from "remix-validated-form";
import { unprocessableEntity } from "remix-utils";

import { prisma } from "@/lib/services/db.server";
import { commitSession, getSession } from "@/lib/services/session.server";
import { authenticator, hashPassword } from "@/lib/services/auth.server";
import { stripe } from "@/lib/services/stripe.server";

import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TENANT_TYPES, USER_TENANT_ROLES } from "@/lib/utils/system";
import { registerValidator } from "@/lib/utils/validation";
import type { JsonErrorResponseFormat } from "@/lib/utils/http";

import { cn } from "@/lib/utils/cn";

import { UserRegisterForm } from "./user-register-form";

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = await registerValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  const { fullName, email, password } = result.data;

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        password: true,
      },
    });

    if (userExists) {
      return unprocessableEntity<JsonErrorResponseFormat>({
        errors: [
          {
            title: "User exists",
            description:
              "Whoops! It looks like that email address is already taken. Please try again using a different email address.",
          },
        ],
      });
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: {
          create: {
            hash: await hashPassword(password),
          },
        },
        tenants: {
          create: {
            role: USER_TENANT_ROLES.OWNER,
            tenant: {
              create: {
                name: fullName,
                type: TENANT_TYPES.PERSONAL,
              },
            },
          },
        },
      },
      include: {
        tenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    const createdTenant = createdUser.tenants.find(
      (tenant) => tenant.userId === createdUser.id
    )?.tenant;

    console.log(JSON.stringify(createdTenant, null, 2));

    invariant(createdTenant, "createdTenant does not exist");

    // const customer = await stripe.customers.create({
    //   name: createdTenant.name,
    //   metadata: {
    //     userId: createdUser.id,
    //     tenantId: createdTenant.id,
    //   },
    // });

    // const updatedTenant = await prisma.tenant.update({
    //   where: {
    //     id: createdTenant.id,
    //   },
    //   data: {
    //     stripeCustomerId: customer.id,
    //   },
    // });

    const session = await getSession(request.headers.get("Cookie"));
    session.set(authenticator.sessionKey, createdUser.id);

    return redirect(`/app/${createdTenant.id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof Stripe.errors.StripeError) {
      console.log("STRIPE ERROR", error);
    } else {
      console.log("UNKNOWN ERROR", error);
    }
    throw error;
  }
}

export default function () {
  const { errors } = useActionData<JsonErrorResponseFormat>() || {};
  return (
    <div className="container relative flex h-full flex-col items-center justify-center lg:px-0">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to create your account
            </p>
          </div>
          <UserRegisterForm validator={registerValidator} />
          {isArray(errors) &&
            errors.map((error, idx) => {
              return (
                <Alert key={idx} variant="destructive">
                  <AlertTitle>{error.title}</AlertTitle>
                  <AlertDescription>{error.description}</AlertDescription>
                </Alert>
              );
            })}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
