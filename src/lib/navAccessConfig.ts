// Role-based sidebar navigation access matrix.
// Single source of truth for which nav items each role can see.
// Items NOT listed here are visible to ALL roles (fail-open for unlisted items).
// Unknown/missing roles default to "citizen" (most restrictive) — fail closed.

import type { Role } from "./types";

/**
 * Maps a sidebar nav route path to the list of roles allowed to access it.
 * Only routes that need restriction are listed here.
 * Routes not present in this map are accessible to every role.
 */
export const NAV_ACCESS: Record<string, readonly Role[]> = {
  // — Workspace group —
  "/dashboard":    ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/properties":   ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/map":          ["citizen", "surveyor", "officer", "admin"],
  "/valuation":    ["citizen", "officer", "bank", "admin"],
  "/assistant":    ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/search":       ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],

  // — AI Intelligence group —
  "/ai":            ["officer", "admin"],
  "/ai-passport":   ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/ai-valuation":  ["bank", "admin"],
  "/ai-ocr":        ["surveyor", "officer", "verifier", "admin"],
  "/ai-fraud":      ["officer", "bank", "admin"],
  "/ai-risk":       ["officer", "bank", "admin"],
  "/ai-confidence": ["citizen", "officer", "verifier", "bank", "admin"],
} as const;

/**
 * Check whether a given role may see/access a specific nav item path.
 * - If the path is in NAV_ACCESS, the role must be in the allowed list.
 * - If the path is NOT in NAV_ACCESS, access is granted (visible to all).
 */
export function canAccessNavItem(role: Role, path: string): boolean {
  const allowed = NAV_ACCESS[path];
  if (!allowed) return true; // not restricted — visible to all roles
  return allowed.includes(role);
}

/**
 * Normalise an unknown/missing role to a valid Role value.
 * Defaults to "citizen" (most restrictive) — fail closed.
 */
const VALID_ROLES: readonly Role[] = ["citizen", "surveyor", "officer", "verifier", "admin", "bank"];

export function normaliseRole(value: string | null | undefined): Role {
  if (value && (VALID_ROLES as readonly string[]).includes(value)) {
    return value as Role;
  }
  return "citizen";
}
