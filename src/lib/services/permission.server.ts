import {
  ADMIN_ROLE_PERMISSIONS,
  BASIC_ROLE_PERMISSIONS,
} from "../utils/system";
import { prisma } from "./db.server";

export async function findAllPermissions() {
  const result = await prisma.permission.findMany();
  return result;
}

export async function getRolePermissions() {
  const allPermissions = await findAllPermissions();

  const ownerPermissions = allPermissions;
  const adminPermissions = allPermissions.filter((permission) =>
    ADMIN_ROLE_PERMISSIONS.includes(
      permission.name as (typeof ADMIN_ROLE_PERMISSIONS)[number]
    )
  );
  const basicPermissions = allPermissions.filter((permission) =>
    BASIC_ROLE_PERMISSIONS.includes(
      permission.name as (typeof BASIC_ROLE_PERMISSIONS)[number]
    )
  );

  return {
    ownerPermissions,
    adminPermissions,
    basicPermissions,
  };
}
