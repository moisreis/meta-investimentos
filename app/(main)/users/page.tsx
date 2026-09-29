import type { Metadata } from "next"

import { LoadUsersPageProps } from "@/presentation/routes/users/helpers/load-users-page-props.helper"
import { UsersList } from "@/presentation/routes/users/pages/list"

export const metadata: Metadata = {
  title: "Usuários",
}

export default async function UsersRoutePage() {
  const PROPS = await LoadUsersPageProps()

  return <UsersList {...PROPS} />
}