import { IUser } from "@domain/user/interfaces/user.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { UserResponseDTO } from "../dto/user-response.dto"
import { toResponseDTO } from "../mappers/user.mapper"

export interface UpdateUserInput {
  userId: string
  name?: string
  firstName?: string
  lastName?: string
  // Clears the profile picture when set to null.
  image?: string | null
}

/**
 * @summary
 * Updates the profile of an existing `User`.
 *
 * @remarks
 * Fetches the user, applies `updateProfile` with the
 * provided fields, and persists the updated entity.
 *
 * @explanation
 * Use this use case to edit the editable profile
 * fields of an existing user through the service
 * layer.
 *
 * @example
 * const USER = await UPDATE_USER_USE_CASE.execute({
 *   userId: "user-1",
 *   name: "Maria Souza",
 *   lastName: "Souza",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Updates and persists a user profile.
   *
   * @remarks
   * Fetches the user, applies `updateProfile` with the
   * provided fields, and persists the updated entity.
   *
   * @explanation
   * Use this method to edit the editable profile
   * fields of an existing user through the service
   * layer.
   *
   * @param input - Payload with the target user id
   *                and field updates.
   *
   * @returns The updated user.
   *
   * @example
   * const USER = await UPDATE_USER_USE_CASE.execute({
   *   userId: "user-1",
   *   name: "Maria Souza",
   *   lastName: "Souza",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdateUserInput): Promise<UserResponseDTO> {
    const ID = EntityId.create(input.userId)
    const USER = await this.userRepository.findById(ID)
    if (!USER) {
      throw new NotFoundError("`User` not found.")
    }
    const UPDATED = USER.updateProfile({
      name: input.name,
      firstName: input.firstName,
      lastName: input.lastName,
      image: input.image,
    })
    const SAVED = await this.userRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
