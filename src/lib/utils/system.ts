/**
 * Types
 */
const TENANT_TYPES = ["INDIVIDUAL", "TEAM"] as const;

export const TENANT_TYPES_MAP = TENANT_TYPES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof TENANT_TYPES)[number], (typeof TENANT_TYPES)[number]>);

/**
 * Roles
 */
export const TENANT_ROLES = ["OWNER", "ADMIN", "BASIC"] as const;
export const TENANT_ROLES_MAP = TENANT_ROLES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof TENANT_ROLES)[number], (typeof TENANT_ROLES)[number]>);

/**
 * Permissions
 */
export const ROLE_PERMISSIONS = [
  "owner:create",
  "owner:delete",
  "admin:create",
  "admin:delete",
  "basic:create",
  "basic:delete",
] as const;
export const ROLE_PERMISSIONS_MAP = ROLE_PERMISSIONS.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof ROLE_PERMISSIONS)[number], (typeof ROLE_PERMISSIONS)[number]>);

export const ADMIN_ROLE_PERMISSIONS = [
  ROLE_PERMISSIONS_MAP["admin:create"],
  ROLE_PERMISSIONS_MAP["admin:delete"],
];
export const BASIC_ROLE_PERMISSIONS = [
  ROLE_PERMISSIONS_MAP["basic:create"],
  ROLE_PERMISSIONS_MAP["basic:delete"],
] as const;
