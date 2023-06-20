import React from "react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { authenticator } from "@/lib/services/auth.server";
import {
  loaderApplication,
  type LoaderApplicationResponse,
} from "@/lib/models/user-tenant.server";
import TenantSwitcher from "./tenant-switcher";
import { serverError } from "remix-utils";
import type { ResponseJSON } from "@/lib/utils/http";

import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const tenantId = params.tenant as string;

  try {
    const { user, tenant, tenants, role } = await loaderApplication({
      userId,
      tenantId,
    });

    return json({
      user,
      tenant,
      tenants,
      role,
    });
  } catch (error) {
    throw serverError<ResponseJSON>({
      errors: [
        {
          name: "Server Error",
          description: "Error in loaderApplication",
        },
      ],
    });
  }
}

export default function Dashboard() {
  const { user, tenant, tenants, role } =
    useLoaderData() as LoaderApplicationResponse;

  React.useEffect(() => {
    if (user && tenant && tenants && role) {
      console.log("user", user);
      console.log("tenant", tenant);
      console.log("tenants", tenants);
      console.log("role", role);
    }
  }, [user, tenant, tenants, role]);

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          {tenants.length > 0 ? <TenantSwitcher tenants={tenants} /> : null}
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-6 p-10 pb-16">
        <Outlet />
      </div>
    </div>
  );
}
