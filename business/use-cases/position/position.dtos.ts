import type { Position } from "@/business/entities/portfolio/position.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a position.
 */
export interface PositionDto {
  id: EntityId;
  portfolioId: EntityId;
  fundId: EntityId;
  initialBalance: string | null;
  initialBalanceDate: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a position's market value on a
 * reference date.
 */
export interface PositionMarketValueDto {
  positionId: EntityId;
  fundId: EntityId;
  referenceDate: Date;
  quotasHeld: string;
  quotaPrice: string | null;
  marketValue: string;
}

/**
 * Maps a `Position` entity to its public DTO representation.
 *
 * @param position - The position entity.
 * @returns The position DTO.
 */
export function toPositionDto(position: Position): PositionDto {
  return {
    id: position.id as EntityId,
    portfolioId: position.portfolioId,
    fundId: position.fundId,
    initialBalance: position.initialBalance?.value.toString() ?? null,
    initialBalanceDate: position.initialBalanceDate,
    version: position.version,
    createdAt: position.createdAt,
    updatedAt: position.updatedAt,
  };
}
