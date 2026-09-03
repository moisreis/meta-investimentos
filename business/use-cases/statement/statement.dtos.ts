import type { Statement } from "@/business/entities/report/statement.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a statement.
 */
export interface StatementDto {
  id: EntityId;
  portfolioId: EntityId | null;
  periodStart: Date;
  periodEnd: Date;
  fileUrl: string;
  generatedByUserId: EntityId | null;
  createdAt: Date;
}

/**
 * Maps a `Statement` entity to its public DTO representation.
 *
 * @param statement - The statement entity.
 * @returns The statement DTO.
 */
export function toStatementDto(statement: Statement): StatementDto {
  return {
    id: statement.id as EntityId,
    portfolioId: statement.portfolioId,
    periodStart: statement.periodStart,
    periodEnd: statement.periodEnd,
    fileUrl: statement.fileUrl,
    generatedByUserId: statement.generatedByUserId,
    createdAt: statement.createdAt,
  };
}
