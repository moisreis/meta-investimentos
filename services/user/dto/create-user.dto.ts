// The role granted to the user on creation.
export type UserRole = "USER" | "MANAGER"

/**
 * @summary
 * Defines the payload for creating a `User`.
 *
 * @remarks
 * The role defaults to `"USER"` when omitted.
 *
 * @explanation
 * Use this DTO to create a user through the service
 * layer.
 *
 * @example
 * const DTO: CreateUserDTO = {
 *   name: "Maria Silva",
 *   email: "maria@example.com",
 *   firstName: "Maria",
 *   lastName: "Silva",
 *   cpf: "123.456.789-09",
 *   role: "MANAGER",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateUserDTO {
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: string
  role?: UserRole
  // Clears the profile picture when set to null.
  image?: string | null
}
