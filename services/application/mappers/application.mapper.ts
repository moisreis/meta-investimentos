import {
  Application,
  type ApplicationProps,
} from "@domain/application/entities/application.entity"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
} from "@/value-objects"
import type { CreateApplicationDTO } from "../dto/create-application.dto"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import type { ReverseApplicationDTO } from "../dto/reverse-application.dto"

/**
 * @summary
 * Maps a create `Application` DTO into entity props.
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
 * const PROPS = toCreateApplicationProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateApplicationProps(
  dto: CreateApplicationDTO
): ApplicationProps {
  return {
    positionId: EntityId.create(dto.positionId),
    date: new Date(dto.date),
    amount: PositiveMoney.create(dto.amount),
    quotas: QuotaQuantity.create(dto.quotas),
  }
}

/**
 * @summary
 * Maps a reverse `Application` DTO into entity props.
 *
 * @remarks
 * Only the reversing user is carried by the payload.
 *
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity reversal props.
 *
 * @example
 * const PROPS = toReverseApplicationProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toReverseApplicationProps(
  dto: ReverseApplicationDTO
): Pick<ApplicationProps, "reversedByUserId"> {
  return {
    reversedByUserId: EntityId.create(dto.reversedByUserId),
  }
}

/**
 * @summary
 * Maps an `Application` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The application domain entity.
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
export function toResponseDTO(
  entity: Application
): ApplicationResponseDTO {
  return {
    id: entity.id as string,
    positionId: entity.positionId,
    date: entity.date.toISOString(),
    amount: entity.amount.value.toString(),
    quotas: entity.quotas.value.toString(),
    reversedAt: entity.reversedAt
      ? entity.reversedAt.toISOString()
      : null,
    reversedByUserId: entity.reversedByUserId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
