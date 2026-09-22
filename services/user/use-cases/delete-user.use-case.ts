import { IUser } from "@domain/user/interfaces/user.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteUserInput {
  userId: string
}

/**
 * @summary
 * Deletes an existing `User`.
 *
 * @remarks
 * Fetches the user and removes it when it exists.
 * Throws **NotFoundError** when no user matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a user through the
 * service layer.
 *
 * @example
 * await DELETE_USER_USE_CASE.execute({
 *   userId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class DeleteUserUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Deletes the user with the provided id.
   *
   * @remarks
   * Fetches the user and removes it when it exists.
   * Throws **NotFoundError** when no user matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a user through the
   * service layer.
   *
   * @param input - Payload with the target user id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_USER_USE_CASE.execute({
   *   userId: "user-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: DeleteUserInput): Promise<void> {
    const ID = EntityId.create(input.userId)
    const USER = await this.userRepository.findById(ID)
    if (!USER) {
      throw new NotFoundError("`User` not found.")
    }
    await this.userRepository.delete(ID)
  }
}
