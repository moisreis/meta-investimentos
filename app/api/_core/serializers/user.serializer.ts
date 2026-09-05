import type {
  CurrentActorDto,
  UserDto,
} from "@/business/use-cases/user/user.dtos";

/**
 * The JSON-safe representation of a user returned by the API.
 */
export interface UserApiDto
  extends Omit<UserDto, "cpf" | "id" | "createdAt" | "updatedAt"> {
  id: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * The JSON-safe representation of the current actor returned by the API.
 */
export interface CurrentActorApiDto extends Omit<CurrentActorDto, "id"> {
  id: string;
}

/**
 * Converts a user DTO to its JSON-safe API representation.
 *
 * The domain DTO carries the CPF value object which would serialize as
 * an object; the API layer flattens it to the raw digit string and
 * normalizes the timestamps.
 *
 * @param dto - The domain user DTO.
 * @returns The JSON-safe user representation.
 */
export function toUserApiDto(dto: UserDto): UserApiDto {
  return {
    ...dto,
    cpf: dto.cpf.value,
    id: dto.id as string,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}
