import { Link, useActionData } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { unprocessableEntity } from "remix-utils";

import { Prisma, prisma } from "@/lib/services/db.server";
import { commitSession, getSession } from "@/lib/services/session.server";
import { authenticator, hashPassword } from "@/lib/services/auth.server";

import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TENANT_ROLES_MAP, TENANT_TYPES_MAP } from "@/lib/utils/system";

import { registerValidator } from "@/lib/utils/validation";
import type { ErrorResponse } from "@/lib/utils/http";

import { cn } from "@/lib/utils/cn";

import { UserRegisterForm } from "./user-register-form";
import { checkExistingUser } from "@/lib/models/user.server";
import { getRolePermissions } from "@/lib/models/permission.server";
// import { createAndAssignStripeCustomer } from "@/lib/services/stripe.server";

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData());

  const result = await registerValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  const { fullName, email, password } = result.data;

  try {
    const isExistingUser = await checkExistingUser({ email });

    if (isExistingUser) {
      return unprocessableEntity<ErrorResponse>({
        error: {
          name: "User exists",
          description:
            "Whoops! It looks like that email address is already taken. Please try again using a different email address.",
        },
      });
    }

    const { ownerPermissions, adminPermissions, basicPermissions } =
      await getRolePermissions();

    const [user, userTenant, tenant] = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          password: {
            create: {
              hash: await hashPassword(password),
            },
          },
        },
      });

      const tenant = await tx.tenant.create({
        data: {
          name: fullName,
          type: TENANT_TYPES_MAP.INDIVIDUAL,
          roles: {
            create: [
              {
                name: TENANT_ROLES_MAP.OWNER,
                permissions: {
                  connect: ownerPermissions.map((permission) => {
                    return { id: permission.id };
                  }),
                },
              },
              {
                name: TENANT_ROLES_MAP.ADMIN,
                permissions: {
                  connect: adminPermissions.map((permission) => {
                    return { id: permission.id };
                  }),
                },
              },
              {
                name: TENANT_ROLES_MAP.BASIC,
                permissions: {
                  connect: basicPermissions.map((permission) => {
                    return { id: permission.id };
                  }),
                },
              },
            ],
          },
        },
        include: {
          roles: true,
        },
      });

      const ownerRole = tenant.roles.find(
        (role) => role.name === TENANT_ROLES_MAP.OWNER
      );

      if (!ownerRole) {
        throw new Error("Unable to find ownerRole");
      }

      const userTenant = await tx.userTenant.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
          role: {
            connect: {
              id: ownerRole.id,
            },
          },
        },
      });

      return [user, userTenant, tenant];
    });

    console.log("✅ user", JSON.stringify(user, null, 2));
    console.log("✅ userTenant", JSON.stringify(userTenant, null, 2));
    console.log("✅ tenant", JSON.stringify(tenant, null, 2));

    // await createAndAssignStripeCustomer({
    //   tenantId: tenant.id,
    //   tenantName: tenant.name,
    // });

    const session = await getSession(request.headers.get("Cookie"));
    session.set(authenticator.sessionKey, user.id);

    return redirect(`/app/${tenant.id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log("error", JSON.stringify(error, null, 2));
    if (error instanceof Response) return error;
    throw error;
  }
}

export default function () {
  const { error } = useActionData<ErrorResponse>() || {};

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
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>{error.name}</AlertTitle>
              {error.description ? (
                <AlertDescription>{error.description}</AlertDescription>
              ) : null}
            </Alert>
          ) : null}
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
