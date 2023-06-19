const ALL_TENANT_TYPES = ["PERSONAL", "TEAM"] as const;

export const TENANT_TYPES = ALL_TENANT_TYPES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof ALL_TENANT_TYPES)[number], (typeof ALL_TENANT_TYPES)[number]>);

const ALL_USER_TENANT_ROLES = ["OWNER", "MEMBER"] as const;

export const USER_TENANT_ROLES = ALL_USER_TENANT_ROLES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof ALL_USER_TENANT_ROLES)[number], (typeof ALL_USER_TENANT_ROLES)[number]>);

export const TENANT_ROLES = ["CREATOR", "ADMIN", "BASIC"] as const;
export const TENANT_ROLES_MAP = TENANT_ROLES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {} as Record<(typeof TENANT_ROLES)[number], (typeof TENANT_ROLES)[number]>);

export const ROLE_PERMISSIONS = [
  "creator:create",
  "creator:delete",
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
