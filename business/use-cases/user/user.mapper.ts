import type { User } from "@/business/entities/user/user.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

import type { CurrentActorDto, UserDto } from "./user.dtos";

/**
 * Maps a `User` entity to its public {@link UserDto} representation.
 *
 * @param user - The user entity to map.
 * @returns The public user DTO.
 */
export function toUserDto(user: User): UserDto {
  return {
    id: user.id as EntityId,
    name: user.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    cpf: user.cpf,
    maskedCpf: user.maskedCpf,
    role: user.role,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Maps a `User` entity to its {@link CurrentActorDto} representation.
 *
 * @param user - The user entity to map.
 * @returns The current-actor DTO.
 */
export function toCurrentActorDto(user: User): CurrentActorDto {
  return {
    id: user.id as EntityId,
    name: user.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}
