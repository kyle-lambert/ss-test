import { type ActionArgs, redirect } from "@remix-run/node";
import { serverError } from "remix-utils";

import { createTenantAndAssignRoles } from "@/lib/models/tenant.server";

import { authenticator } from "@/lib/services/auth.server";

import { TENANT_TYPES_MAP } from "@/lib/utils/system";
import { type ErrorResponse } from "@/lib/utils/http";
import { createTeamValidator, validateAction } from "@/lib/utils/validation";

type FormSubaction = "create" | "update" | "delete";

export async function action({ request }: ActionArgs) {
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });

  const formData = await request.formData();
  const subaction = formData.get("subaction") as FormSubaction;

  try {
    switch (subaction) {
      case "create": {
        return await validateAction(
          {
            validator: createTeamValidator,
            unvalidatedData: formData,
          },
          async ({ name }) => {
            const { tenant } = await createTenantAndAssignRoles({
              creatorId: userId,
              tenantName: name,
              tenantType: TENANT_TYPES_MAP.TEAM,
            });
            return redirect(`/app/${tenant.id}/overview`);
          }
        );
      }
      default: {
        throw new Error("Unhandled form subaction");
      }
    }
  } catch (error) {
    return serverError<ErrorResponse>({
      error: {
        name: "Server error",
        description: "Error occured in resource.tenant route",
      },
    });
  }
}
