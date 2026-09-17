import {
  Position,
  type PositionProps,
} from "@domain/position/entities/position.entity"
import { EntityId, PositiveMoney } from "@/value-objects"
import type { CreatePositionDTO } from "../dto/create-position.dto"
import type { PositionResponseDTO } from "../dto/position-response.dto"

/**
 * @summary
 * Maps a create `Position` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props accepted by `Position.create`.
 */
export function toCreatePositionProps(dto: CreatePositionDTO): PositionProps {
  return {
    portfolioId: EntityId.create(dto.portfolioId),
    fundId: EntityId.create(dto.fundId),
    initialBalance: dto.initialBalance
      ? PositiveMoney.create(dto.initialBalance)
      : null,
    initialBalanceDate: dto.initialBalanceDate
      ? new Date(dto.initialBalanceDate)
      : null,
  }
}

/**
 * @summary
 * Maps a `Position` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings. Null fields are preserved.
 *
 * @param entity - The position domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Position): PositionResponseDTO {
  return {
    id: entity.id as string,
    portfolioId: entity.portfolioId,
    fundId: entity.fundId,
    initialBalance: entity.initialBalance
      ? entity.initialBalance.value.toString()
      : null,
    initialBalanceDate: entity.initialBalanceDate
      ? entity.initialBalanceDate.toISOString()
      : null,
    version: entity.version,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
