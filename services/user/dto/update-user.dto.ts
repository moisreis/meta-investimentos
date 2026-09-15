import type { UserRole } from "./create-user.dto"

/**
 * @summary
 * Defines the payload for updating a `User` profile.
 *
 * @remarks
 * Only the provided fields are changed.
 *
 * @explanation
 * Use this DTO to edit the editable profile fields of
 * an existing user.
 *
 * @example
 * const DTO: UpdateUserDTO = {
 *   name: "Maria Souza",
 *   lastName: "Souza",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateUserDTO {
  name?: string
  firstName?: string
  lastName?: string
  // Clears the profile picture when set to null.
  image?: string | null
}
