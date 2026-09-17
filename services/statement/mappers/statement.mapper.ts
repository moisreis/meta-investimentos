import {
  Statement,
  type StatementProps,
} from "@domain/statement/entities/statement.entity"
import { EntityId } from "@/value-objects"
import type { GenerateStatementDTO } from "../dto/generate-statement.dto"
import type { StatementResponseDTO } from "../dto/statement-response.dto"

/**
 * @summary
 * Maps a generate `Statement` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into the domain value
 * objects required by the entity factory. The file URL
 * is omitted because the file is produced downstream.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Statement props without the file URL.
 */
export function toCreateStatementProps(
  dto: GenerateStatementDTO
): Omit<StatementProps, "fileUrl"> {
  return {
    portfolioId: dto.portfolioId ? EntityId.create(dto.portfolioId) : null,
    periodStart: new Date(dto.periodStart),
    periodEnd: new Date(dto.periodEnd),
    generatedByUserId: dto.generatedByUserId
      ? EntityId.create(dto.generatedByUserId)
      : null,
  }
}

/**
 * @summary
 * Maps a `Statement` entity into a response DTO.
 *
 * @remarks
 * Serializes dates to ISO 8601 strings and keeps null
 * ids for portfolio-wide statements.
 *
 * @param entity - The statement domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Statement): StatementResponseDTO {
  return {
    id: entity.id as string,
    portfolioId: entity.portfolioId,
    periodStart: entity.periodStart.toISOString(),
    periodEnd: entity.periodEnd.toISOString(),
    fileUrl: entity.fileUrl,
    generatedByUserId: entity.generatedByUserId,
    createdAt: entity.createdAt.toISOString(),
  }
}
