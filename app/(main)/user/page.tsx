import type { Metadata } from "next"

import { LoadUserPageProps } from "@/presentation/routes/user/helpers/load-user-page-props.helper"
import { UserList } from "@/presentation/routes/user/pages/list"

export const metadata: Metadata = {
  title: "Usuários",
}

/**
 * @summary
 * Route page of the user list screen.
 *
 * @remarks
 * Loads the props of the screen on the server, so the
 * first paint already carries the data, and hands them
 * to the route page that composes the screen. The page
 * itself only decides the title and the entry point, so
 * the same route page can be rendered from anywhere.
 *
 * @returns The route page of the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export default async function UsersRoutePage() {
  const PROPS = await LoadUserPageProps()

  return <UserList {...PROPS} />
}
