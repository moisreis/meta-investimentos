import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/infrastructure/clients/better-auth.client";

/**
 * Mount the *Better Auth* HTTP endpoints.
 *
 * All authentication routes (`/api/auth/*`) — sign-in, sign-up, session,
 * and sign-out — are handled by this single catch-all route handler backed
 * by the shared `auth` instance.
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */
export const { GET, POST } = toNextJsHandler(auth);
