export const STAFF_ROLES = [
  'Admin',
  'Manager',
  'Sales/Marketing',
  'Marketing/Sales',
  'Graphic Designer',
  'Accountant',
] as const;

export const STAFF_ROLE_OPTIONS: StaffRole[] = [
  'Admin',
  'Manager',
  'Sales/Marketing',
  'Graphic Designer',
  'Accountant',
];

export type StaffRole = (typeof STAFF_ROLES)[number];

export const ALWAYS_ALLOWED_ROLES: StaffRole[] = ['Admin', 'Manager'];

export const DEFAULT_GENERAL_ACCESS_ROLE: StaffRole = 'Sales/Marketing';

export function normalizeRole(role?: string | null): StaffRole | null {
  if (!role) return null;
  const trimmed = role.trim();

  if (trimmed === 'Sales') {
    return 'Sales/Marketing';
  }

  if (trimmed.toLowerCase() === 'marketing/sales') {
    return 'Sales/Marketing';
  }

  const match = STAFF_ROLES.find(
    (allowed) => allowed.toLowerCase() === trimmed.toLowerCase(),
  );

  return match ?? null;
}

export function isRoleAllowed(role?: string | null): role is StaffRole {
  return normalizeRole(role) !== null;
}

export function isAlwaysAllowed(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return ALWAYS_ALLOWED_ROLES.includes(normalized);
}

