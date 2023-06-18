import invariant from "tiny-invariant";
import { type LoaderArgs, redirect } from "@remix-run/node";

import { prisma } from "@/lib/services/db.server";
import { authenticator } from "@/lib/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tenants: {
        include: {
          tenant: true,
        },
      },
    },
  });

  invariant(user, "User not found");
  invariant(user.tenants.length, "UserTenants not found");

  const tenantId = user.tenants[0].tenant.id;
  return redirect(tenantId);
}
