import type { UserRole } from "./create-user.dto"

/**
 * @summary
 * Represents the shape of the user response.
 *
 * @remarks
 * This DTO is the format of the response for user
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a user to the consumers
 * of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(USER_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UserResponseDTO {
  id: string
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: string
  // Partially masked `CPF` for safe display.
  maskedCpf: string
  role: UserRole
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}
