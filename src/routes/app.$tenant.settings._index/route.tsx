import { authenticator } from "@/lib/services/auth.server";
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderArgs) {
  const tenantId = params.tenant as string;
  return authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
    successRedirect: `/app/${tenantId}/settings/account`,
  });
}
