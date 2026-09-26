import type { Metadata } from "next"

import { LoadUsers } from "@/presentation/routes/users/helpers/load-users.helper"
import { UsersList } from "@/presentation/routes/users/pages/list"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

export const metadata: Metadata = {
  title: "Usuários",
}

export default async function UsersRoutePage() {
  const USERS: UserResponseDTO[] | null = await LoadUsers()

  return (
    <>
      <UsersList data={USERS} />
    </>
  )
}
