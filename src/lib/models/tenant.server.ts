import type { Tenant, User } from "@prisma/client";
import { prisma } from "../services/db.server";
import { getRolePermissions } from "./permission.server";
import { TENANT_ROLES_MAP } from "../utils/system";

export async function createTenantAndAssignRoles({
  creatorId,
  tenantName,
  tenantType,
}: {
  creatorId: User["id"];
  tenantName: Tenant["name"];
  tenantType: Tenant["type"];
}) {
  const { ownerPermissions, adminPermissions, basicPermissions } =
    await getRolePermissions();

  const [tenant, userTenant] = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: tenantName,
        type: tenantType,
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
            id: creatorId,
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

    return [tenant, userTenant];
  });

  return {
    tenant,
    userTenant,
  };
}
