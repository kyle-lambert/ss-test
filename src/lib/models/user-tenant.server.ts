import { prisma } from "../services/db.server";
import type { Role, Tenant, User } from "@prisma/client";

export async function loaderApplication({
  userId,
  tenantId,
}: {
  userId: User["id"];
  tenantId: Tenant["id"];
}) {
  const userTenantPromise = prisma.userTenant.findUnique({
    where: {
      userId_tenantId: {
        userId,
        tenantId,
      },
    },
    include: {
      user: true,
      tenant: true,
      role: true,
    },
  });

  const tenantsPromise = prisma.tenant.findMany({
    where: {
      users: {
        every: {
          user: {
            id: userId,
          },
        },
      },
    },
  });

  const [userTenantQuery, tenantsQuery] = await Promise.allSettled([
    userTenantPromise,
    tenantsPromise,
  ]);

  if (userTenantQuery.status === "rejected" || !userTenantQuery.value) {
    throw new Error("Unable to find userTenant");
  }
  if (tenantsQuery.status === "rejected" || !tenantsQuery.value) {
    throw new Error("Unable to find tenants");
  }

  const { user, tenant, role } = userTenantQuery.value;
  const tenants = tenantsQuery.value;

  return {
    user,
    tenant,
    tenants,
    role,
  };
}

export type LoaderApplicationResponse = {
  user: User;
  tenant: Tenant;
  tenants: Tenant[];
  role: Role;
};
