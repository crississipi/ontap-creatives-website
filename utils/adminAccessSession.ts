import {
  ALWAYS_ALLOWED_ROLES,
  normalizeRole,
  StaffRole,
} from '@/constants/staffRoles';

const ROLE_SESSION_STORAGE_KEY = 'ontap::adminRoleSession';
const GENERAL_VISIBILITY_STORAGE_KEY = 'ontap::adminGeneralVisibility';
const ROLE_SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const GENERAL_VISIBILITY_DURATION_MS = 1000 * 60 * 30; // 30 minutes

export interface AdminRoleSession {
  role: StaffRole;
  persistent: boolean;
  expiresAt: string | null;
  lastRefreshed: string;
  createdAt: string;
}

export interface GeneralVisibilitySession {
  enabled: boolean;
  expiresAt: string;
  updatedAt: string;
}

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function readStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[adminAccessSession] Failed to parse ${key}`, error);
    return null;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorage(key: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

function isSessionExpired(session: AdminRoleSession): boolean {
  if (session.persistent) return false;
  if (!session.expiresAt) return true;
  return new Date(session.expiresAt).getTime() <= Date.now();
}

export function loadRoleSession(): AdminRoleSession | null {
  const session = readStorage<AdminRoleSession>(ROLE_SESSION_STORAGE_KEY);
  if (!session) return null;

  const normalizedRole = normalizeRole(session.role);
  if (!normalizedRole) {
    clearRoleSession();
    return null;
  }

  const parsedSession: AdminRoleSession = {
    ...session,
    role: normalizedRole,
  };

  if (isSessionExpired(parsedSession)) {
    clearRoleSession();
    return null;
  }

  return parsedSession;
}

export function saveRoleSession(role: StaffRole): AdminRoleSession {
  const now = new Date();
  const persistent = ALWAYS_ALLOWED_ROLES.includes(role);
  const expiresAt = persistent
    ? null
    : new Date(now.getTime() + ROLE_SESSION_DURATION_MS).toISOString();

  const session: AdminRoleSession = {
    role,
    persistent,
    expiresAt,
    lastRefreshed: now.toISOString(),
    createdAt: now.toISOString(),
  };

  writeStorage(ROLE_SESSION_STORAGE_KEY, session);
  syncCookieWithSession(session);

  return session;
}

export function refreshStoredRoleSession(): AdminRoleSession | null {
  const current = loadRoleSession();
  if (!current) return null;

  if (isSessionExpired(current)) {
    clearRoleSession();
    return null;
  }

  if (!current.persistent) {
    current.expiresAt = new Date(
      Date.now() + ROLE_SESSION_DURATION_MS,
    ).toISOString();
  }
  current.lastRefreshed = new Date().toISOString();

  writeStorage(ROLE_SESSION_STORAGE_KEY, current);
  syncCookieWithSession(current);

  return current;
}

export function clearRoleSession() {
  removeStorage(ROLE_SESSION_STORAGE_KEY);
  if (isBrowser()) {
    document.cookie = `${ROLE_SESSION_STORAGE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

export function hasActiveRoleSession(): boolean {
  return !!refreshStoredRoleSession();
}

export function setGeneralVisibility(
  enabled: boolean,
): GeneralVisibilitySession | null {
  if (!enabled) {
    removeStorage(GENERAL_VISIBILITY_STORAGE_KEY);
    return null;
  }

  const now = new Date();
  const payload: GeneralVisibilitySession = {
    enabled: true,
    expiresAt: new Date(
      now.getTime() + GENERAL_VISIBILITY_DURATION_MS,
    ).toISOString(),
    updatedAt: now.toISOString(),
  };

  writeStorage(GENERAL_VISIBILITY_STORAGE_KEY, payload);
  return payload;
}

export function getGeneralVisibility():
  | GeneralVisibilitySession
  | null {
  const setting = readStorage<GeneralVisibilitySession>(
    GENERAL_VISIBILITY_STORAGE_KEY,
  );

  if (!setting?.enabled) {
    return null;
  }

  if (new Date(setting.expiresAt).getTime() <= Date.now()) {
    removeStorage(GENERAL_VISIBILITY_STORAGE_KEY);
    return null;
  }

  return setting;
}

export function isGeneralVisibilityActive(
  setting?: GeneralVisibilitySession | null,
): boolean {
  const value = setting ?? getGeneralVisibility();
  if (!value) return false;
  if (!value.enabled) return false;
  return new Date(value.expiresAt).getTime() > Date.now();
}

export function canUseSecretKeyAccess(): boolean {
  if (refreshStoredRoleSession()) {
    return true;
  }
  return isGeneralVisibilityActive();
}

function syncCookieWithSession(session: AdminRoleSession) {
  if (!isBrowser()) return;
  const expires = session.expiresAt
    ? `;expires=${new Date(session.expiresAt).toUTCString()}`
    : ';max-age=315360000'; // 10 years

  document.cookie = `${ROLE_SESSION_STORAGE_KEY}=${
    session.role
  }${expires};path=/;SameSite=Lax`;
}

