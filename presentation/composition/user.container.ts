import { db } from "@/clients/database.client"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { BulkDeleteUsersUseCase } from "@/services/user/use-cases/bulk-delete-users.use-case"
import { CreateUserUseCase } from "@/services/user/use-cases/create-user.use-case"
import { DeleteUserUseCase } from "@/services/user/use-cases/delete-user.use-case"
import { GetUserUseCase } from "@/services/user/use-cases/get-user.use-case"
import { ListUsersUseCase } from "@/services/user/use-cases/list-users.use-case"
import { UpdateUserUseCase } from "@/services/user/use-cases/update-user.use-case"

// The user use cases, already wired to the repository.
interface UserUseCases {
  bulkDelete: BulkDeleteUsersUseCase
  create: CreateUserUseCase
  get: GetUserUseCase
  list: ListUsersUseCase
  remove: DeleteUserUseCase
  update: UpdateUserUseCase
}

/**
 * @summary
 * Wires the user use cases to the user repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs a
 * user use case.
 *
 * @returns The wired user use cases.
 *
 * @example
 * const { create: CREATE_USER } = UserContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function UserContainer(): UserUseCases {
  const REPOSITORY = new UserRepository(db)

  return {
    bulkDelete: new BulkDeleteUsersUseCase(REPOSITORY),
    create: new CreateUserUseCase(REPOSITORY),
    get: new GetUserUseCase(REPOSITORY),
    list: new ListUsersUseCase(REPOSITORY),
    remove: new DeleteUserUseCase(REPOSITORY),
    update: new UpdateUserUseCase(REPOSITORY),
  }
}

export { UserContainer, type UserUseCases }
