import { createAuthClient } from "better-auth/react";

/**
 * Browser-side *Better Auth* client.
 *
 * The client talks to the `/api/auth/*` endpoints handled by the server
 * `auth` instance (`infrastructure/clients/better-auth.client.ts`) through
 * the same origin, so no `baseURL` is required.
 *
 * @remarks
 * This module is the single source of truth for the browser-side
 * authentication client. Hooks under `presentation/hooks/auth` should
 * import `AUTH_CLIENT` from here instead of creating a new client.
 */
export const AUTH_CLIENT = createAuthClient();
