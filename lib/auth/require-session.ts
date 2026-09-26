import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"

// The authenticated principal of the current request.
interface SessionUser {
  id: string
}

/**
 * @summary
 * Resolves the authenticated user of the request.
 *
 * @remarks
 * Reads the session from the request headers, so the
 * acting user is always derived server-side. Never accept
 * a user id from the client as a substitute for this
 * check: a hidden field is not access control.
 *
 * @explanation
 * Call this as the first statement of every server action
 * and of every server loader, and bail out when it returns
 * null.
 *
 * @returns The session user, or `null` when signed out.
 *
 * @example
 * const USER = await RequireSessionUser();
 * if (!USER) return ActionFailure("Faça login para continuar.");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
async function RequireSessionUser(): Promise<SessionUser | null> {
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  return { id: SESSION.user.id }
}

export { RequireSessionUser, type SessionUser }
