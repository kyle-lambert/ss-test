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
