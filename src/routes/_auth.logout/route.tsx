import { authenticator } from "@/lib/services/auth.server";
import { type ActionArgs } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  return await authenticator.logout(request, {
    redirectTo: "/login",
  });
}
