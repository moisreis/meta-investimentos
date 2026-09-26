import { IUser } from "@domain/user/interfaces/user.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteUsersInput {
  userIds: string[]
}

/**
 * @summary
 * Deletes multiple `User` records.
 *
 * @remarks
 * Hydrates the users by their ids and removes the rows
 * that still exist. Missing users are silently skipped.
 *
 * @explanation
 * Use this use case to remove many users through the
 * service layer.
 *
 * @example
 * await BULK_DELETE_USERS_USE_CASE.execute({
 *   userIds: ["user-1", "user-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteUsersUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Removes the users with the provided ids.
   *
   * @remarks
   * Hydrates the users by their ids and removes the rows
   * that still exist. Missing users are silently skipped.
   *
   * @explanation
   * Use this method to delete many users in one operation.
   *
   * @param input - Payload with the target user ids.
   *
   * @returns Resolves when the remaining rows are removed.
   *
   * @example
   * await BULK_DELETE_USERS_USE_CASE.execute({
   *   userIds: ["user-1", "user-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: BulkDeleteUsersInput): Promise<void> {
    if (input.userIds.length === 0) {
      return
    }

    const IDS = input.userIds.map((id) => EntityId.create(id))
    const USERS = await this.userRepository.findAllByIds(IDS)

    const FOUND_IDS = USERS.map((user) => user.id).filter(
      (id): id is EntityId => Boolean(id)
    )

    if (FOUND_IDS.length === 0) {
      return
    }

    await Promise.all(
      FOUND_IDS.map((id) => this.userRepository.delete(id))
    )
  }
}
