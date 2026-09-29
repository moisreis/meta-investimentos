import { LoadUsers } from "../helpers/load-users.helper"
import type { UsersListProps } from "../pages/list"
import type { UserRow } from "@/presentation/types/user-row.types"
import { UserContainer } from "@/presentation/composition/user.container"

/**
 * @summary
 * Resolves the props for the user list page.
 *
 * @remarks
 * Loads the session users.
 *
 * @returns The user list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadUsersPageProps();
 *
 * @author MoisAcs Reis
 *
 * @date 2026-09-27
 */
export async function LoadUsersPageProps(): Promise<UsersListProps> {
  let data: UserRow[] | null = null

  const LOADED = await LoadUsers()

  if (LOADED) {
    return { data: LOADED }
  }

  return { data: null }
}