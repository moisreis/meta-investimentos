import { IUser } from "@domain/user/interfaces/user.interface"
import type { UserResponseDTO } from "../dto/user-response.dto"
import { toResponseDTO } from "../mappers/user.mapper"

export interface ListUsersInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `User` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list users through the service
 * layer.
 *
 * @example
 * const USERS = await LIST_USERS_USE_CASE.execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListUsersUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Fetches all users, optionally paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list users through the service
   * layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching users.
   *
   * @example
   * const USERS = await LIST_USERS_USE_CASE.execute({});
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListUsersInput
  ): Promise<UserResponseDTO[]> {
    const USERS = await this.userRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return USERS.map(toResponseDTO)
  }
}
