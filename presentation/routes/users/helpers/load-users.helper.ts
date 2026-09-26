import { RequireSessionUser } from "@/lib/auth/require-session"
import { UserContainer } from "@/presentation/composition/user.container"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Resolves the session user and the registered users.
 *
 * @remarks
 * Derives the acting user from the session and lists all
 * users of the platform through the use case. Returns null
 * when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the user listing stay in a single place.
 *
 * @returns The user rows, or `null`.
 *
 * @example
 * const USERS = await LoadUsers();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadUsers(): Promise<
  UserResponseDTO[] | null
> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_USERS } = UserContainer()

  return await LIST_USERS.execute({})
}
