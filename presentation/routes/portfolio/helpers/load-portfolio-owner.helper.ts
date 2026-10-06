import { LogError } from "@/lib/log/logger"
import { UserContainer } from "@/presentation/composition/user.container"
import { ToUserIdentity } from "@/presentation/mappers/user-identity.mapper"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

/**
 * @summary
 * Resolves the identity of the user who owns a portfolio.
 *
 * @remarks
 * Reads the profile of the given user through the container
 * and projects it down to the three fields that name a
 * person. A failure here degrades to null rather than
 * failing the screen: the detail summary then opens on the
 * figure alone, which is still a readable page, and the
 * portfolio itself is the subject the reader came for.
 *
 * @explanation
 * Use this helper from the portfolio detail loader. The
 * owner is read by the id the portfolio carries, not by the
 * session, so the byline keeps naming the owner if the
 * ownership rule ever stops being the session user.
 *
 * @param userId - The id of the portfolio owner.
 *
 * @returns The identity of the owner, or `null`.
 *
 * @example
 * const OWNER = await LoadPortfolioOwner("user-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export async function LoadPortfolioOwner(
  userId: string
): Promise<UserIdentity | null> {
  if (!userId) return null

  try {
    const { get: GET_USER } = UserContainer()

    return ToUserIdentity(await GET_USER.execute({ userId }))
  } catch (cause) {
    LogError(
      "LoadPortfolioOwner",
      `failed to resolve the owner ${userId} of the portfolio.`,
      cause
    )
    return null
  }
}
