import { IUser } from "@domain/user/interfaces/user.interface"
import { EntityId } from "@/value-objects"
import type { UserResponseDTO } from "../dto/user-response.dto"
import { toResponseDTO } from "../mappers/user.mapper"

export interface ListUsersByIdsInput {
  userIds: string[]
}

/**
 * @summary
 * Lists the `User` entries with the provided ids.
 *
 * @remarks
 * Batches the lookup so a single repository call resolves
 * every id instead of one query per user.
 *
 * @explanation
 * Use this use case to hydrate many users at once, such as
 * resolving the actors of an audit trail.
 *
 * @example
 * const USERS = await LIST_USERS_BY_IDS_USE_CASE.execute({
 *   userIds: ["user-1", "user-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListUsersByIdsUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Fetches the users matching the provided ids.
   *
   * @remarks
   * Returns only the users that exist. Callers resolve the
   * missing ones individually.
   *
   * @param input - Payload with the target user ids.
   *
   * @returns The matching users.
   *
   * @example
   * const USERS = await LIST_USERS_BY_IDS_USE_CASE.execute({
   *   userIds: ["user-1", "user-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListUsersByIdsInput
  ): Promise<UserResponseDTO[]> {
    const IDS = input.userIds.map((id) => EntityId.create(id))
    const USERS = await this.userRepository.findAllByIds(IDS)

    return USERS.map(toResponseDTO)
  }
}
