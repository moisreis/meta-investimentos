"use client";

import { AUTH_CLIENT } from "@/infrastructure/clients/auth.client";

type SessionUserRole = "USER" | "MANAGER";

/**
 * Browser-session user augmented with the project's custom profile fields.
 *
 * *Better Auth* only infers the base user columns in its client types, so
 * the extra fields persisted by the app (`firstName`, `lastName`, `role`)
 * are surfaced through this projection.
 */
type CurrentUser = {
  firstName?: string;
  lastName?: string;
  role?: SessionUserRole;
};

/**
 * Provides the currently signed-in user's profile and access data.
 *
 * Pulls the authenticated user straight from the browser *Better Auth*
 * session and exposes the pieces needed to render the user's identity in
 * the interface: their full name (concatenation of first and last name),
 * an uppercase initial used as an avatar fallback, and their role so the
 * UI can gate manager-only areas.
 */
export function useCurrentUser() {
  const { data: SESSION } = AUTH_CLIENT.useSession();
  const USER = (SESSION?.user ?? {}) as CurrentUser;

  const FIRST_NAME = USER.firstName ?? "";
  const LAST_NAME = USER.lastName ?? "";
  const ROLE = USER.role ?? "USER";
  const FULL_NAME = [FIRST_NAME, LAST_NAME].filter(Boolean).join(" ").trim();
  const INITIAL = FIRST_NAME.charAt(0).toUpperCase();
  const IS_MANAGER = ROLE === "MANAGER";

  return { FULL_NAME, INITIAL, ROLE, IS_MANAGER };
}
