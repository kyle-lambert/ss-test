import { type LoaderArgs } from "@remix-run/node";

import { authenticator } from "@/lib/services/auth.server";

export async function loader({ request, params }: LoaderArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
}

export default function Dashboard() {
  return <div>Dashboard</div>;
}
