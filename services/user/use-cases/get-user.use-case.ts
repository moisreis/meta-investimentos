import { IUser } from "@domain/user/interfaces/user.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { UserResponseDTO } from "../dto/user-response.dto"
import { toResponseDTO } from "../mappers/user.mapper"

export interface GetUserInput {
  userId: string
}

/**
 * @summary
 * Retrieves an existing `User` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no user matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single user through
 * the service layer.
 *
 * @example
 * const USER = await GET_USER_USE_CASE.execute({
 *   userId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetUserUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Fetches the user with the provided id.
   *
   * @param input - Payload with the target user id.
   * @returns The matching user response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetUserInput): Promise<UserResponseDTO> {
    const ID = EntityId.create(input.userId)
    const USER = await this.userRepository.findById(ID)
    if (!USER) {
      throw new NotFoundError("`User` not found.")
    }
    return toResponseDTO(USER)
  }
}