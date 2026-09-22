import { User, type UserProps } from "@domain/user/entities/user.entity"
import { CPF } from "@/value-objects"
import type { CreateUserDTO } from "../dto/create-user.dto"
import type { UserResponseDTO } from "../dto/user-response.dto"

/**
 * @summary
 * Maps a create `User` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity creation props.
 *
 * @example
 * const PROPS = toCreateUserProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateUserProps(dto: CreateUserDTO): UserProps {
  return {
    name: dto.name,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    cpf: CPF.create(dto.cpf),
    role: dto.role,
    image: dto.image,
  }
}

/**
 * @summary
 * Maps a `User` entity into a response DTO.
 *
 * @remarks
 * Serializes the **CPF** to a string and timestamps to ISO
 * 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The user domain entity.
 *
 * @returns The response payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toResponseDTO(entity: User): UserResponseDTO {
  return {
    id: entity.id as string,
    name: entity.name,
    email: entity.email,
    firstName: entity.firstName,
    lastName: entity.lastName,
    cpf: entity.cpf.value,
    maskedCpf: entity.maskedCpf,
    role: entity.role,
    emailVerified: entity.emailVerified,
    image: entity.image,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
