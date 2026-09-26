import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"
import { ListUsersUseCase } from "@/services/user/use-cases/list-users.use-case"

/**
 * @summary
 * Resolves the session user and the registered users.
 *
 * @remarks
 * Fetches the session from the request headers and lists
 * all users of the platform. Returns null when there is
 * no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the user listing stay in a single
 * composition point.
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
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const USER_REPOSITORY = new UserRepository(db)
  const LIST_USE_CASE = new ListUsersUseCase(USER_REPOSITORY)
  const USERS = await LIST_USE_CASE.execute({})

  return USERS
}
