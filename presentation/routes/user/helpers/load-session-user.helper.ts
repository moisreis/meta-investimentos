import { RequireSessionUser } from "@/lib/auth/require-session"
import { LogError } from "@/lib/log/logger"
import { UserContainer } from "@/presentation/composition/user.container"
import { ToUserIdentity } from "@/presentation/mappers/user-identity.mapper"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

/**
 * @summary
 * Resolves the identity of the signed-in user.
 *
 * @remarks
 * Derives the acting user from the session and reads the
 * profile through the container, projecting it down to the
 * three fields that name a person. A failure here degrades
 * to null rather than taking the whole chrome down: the
 * sidebar header then drops the identity and keeps the menu,
 * because a missing name is not a reason to fail every
 * authenticated screen.
 *
 * @explanation
 * Use this helper from the main route layout so the session
 * resolution and the profile read stay in a single place
 * instead of being repeated by every screen.
 *
 * @returns The identity of the session user, or `null`.
 *
 * @example
 * const USER = await LoadSessionUser();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export async function LoadSessionUser(): Promise<UserIdentity | null> {
  try {
    const SESSION = await RequireSessionUser()

    if (!SESSION) return null

    const { get: GET_USER } = UserContainer()

    return ToUserIdentity(
      await GET_USER.execute({ userId: SESSION.id })
    )
  } catch (cause) {
    LogError(
      "LoadSessionUser",
      "failed to resolve the session user.",
      cause
    )
    return null
  }
}
