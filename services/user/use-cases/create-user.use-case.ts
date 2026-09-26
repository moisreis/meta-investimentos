import { User } from "@domain/user/entities/user.entity"
import { IUser } from "@domain/user/interfaces/user.interface"
import type { UserRole } from "../dto/create-user.dto"
import type { UserResponseDTO } from "../dto/user-response.dto"
import {
  toCreateUserProps,
  toResponseDTO,
} from "../mappers/user.mapper"

export interface CreateUserInput {
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: string
  role?: UserRole
  // Clears the profile picture when set to null.
  image?: string | null
}

/**
 * @summary
 * Creates a new `User` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the user with the user repository.
 *
 * @explanation
 * Use this use case to register a new user through
 * the service layer.
 *
 * @example
 * const USER = await CREATE_USER_USE_CASE.execute({
 *   name: "Maria Silva",
 *   email: "maria@example.com",
 *   firstName: "Maria",
 *   lastName: "Silva",
 *   cpf: "123.456.789-09",
 *   role: "MANAGER",
 *   image: null,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUser) {}

  /**
   * @summary
   * Creates and persists a new user.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the user with the user repository.
   *
   * @explanation
   * Use this method to register a new user through
   * the service layer.
   *
   * @param input - The user creation payload.
   *
   * @returns The persisted user.
   *
   * @example
   * const USER = await CREATE_USER_USE_CASE.execute({
   *   name: "Maria Silva",
   *   email: "maria@example.com",
   *   firstName: "Maria",
   *   lastName: "Silva",
   *   cpf: "123.456.789-09",
   *   role: "MANAGER",
   *   image: null,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreateUserInput
  ): Promise<UserResponseDTO> {
    const PROPS = toCreateUserProps(input)
    const USER = User.create(PROPS)
    const SAVED = await this.userRepository.save(USER)
    return toResponseDTO(SAVED)
  }
}
