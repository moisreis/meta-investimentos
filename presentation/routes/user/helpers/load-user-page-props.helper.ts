import { LoadUsers } from "../helpers/load-users.helper"
import type { UserListProps } from "../pages/list"

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
 * const PROPS = await LoadUserPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadUserPageProps(): Promise<UserListProps> {
  const LOADED = await LoadUsers()

  if (LOADED) {
    return { data: LOADED }
  }

  return { data: null }
}
