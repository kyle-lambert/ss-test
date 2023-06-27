import React from "react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { authenticator } from "@/lib/services/auth.server";
import {
  loaderApplication,
  type LoaderApplicationResponse,
} from "@/lib/models/user-tenant.server";
import TenantSwitcher from "./tenant-switcher";
import { serverError } from "remix-utils";
import type { ErrorResponse } from "@/lib/utils/http";

import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Library, ListMusic, Mic2, Music2, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
    throw serverError<ErrorResponse>({
      error: {
        name: "Server error",
        description: "Error while tyring to load loaderApplication",
      },
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
    <div className="flex h-full">
      <div>
        <aside className="flex h-full w-64 flex-col border-r">
          <header className="flex h-16 items-center px-4">
            <h2 className=" text-lg font-semibold tracking-tight">Header</h2>
          </header>
          <div className="flex-1 px-4 pt-8">
            <div className="space-y-1">
              <NavLink
                to="./overview"
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    isActive ? "bg-muted hover:bg-muted" : "hover:bg-muted",
                    "w-full justify-start"
                  )
                }
              >
                <ListMusic className="mr-2 h-4 w-4" />
                Overview
              </NavLink>
              <NavLink
                to="./team"
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    isActive ? "bg-muted hover:bg-muted" : "hover:bg-muted",
                    "w-full justify-start"
                  )
                }
              >
                <Music2 className="mr-2 h-4 w-4" />
                Team
              </NavLink>
              <NavLink
                to="./settings"
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    isActive ? "bg-muted hover:bg-muted" : "hover:bg-muted",
                    "w-full justify-start"
                  )
                }
              >
                <User className="mr-2 h-4 w-4" />
                Settings
              </NavLink>
            </div>
          </div>
        </aside>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {tenants.length > 0 ? <TenantSwitcher tenants={tenants} /> : null}
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={user} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 p-8 pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
