import type { Norm } from "@/business/entities/portfolio/norm.entity";
import type { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a norm.
 */
export interface NormDto {
  id: EntityId;
  articleNumber: string;
  name: string;
  categoryId: EntityId;
  minAllocation: string;
  maxAllocation: string;
  targetAllocation: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a norms-portfolios relation.
 */
export interface NormsPortfoliosDto {
  id: EntityId;
  normId: EntityId;
  portfolioId: EntityId;
  minAllocation: string;
  maxAllocation: string;
  targetAllocation: string;
  createdAt: Date;
}

/**
 * Maps a `Norm` entity to its public DTO representation.
 *
 * @param norm - The norm entity.
 * @returns The norm DTO.
 */
export function toNormDto(norm: Norm): NormDto {
  return {
    id: norm.id as EntityId,
    articleNumber: norm.articleNumber,
    name: norm.name,
    categoryId: norm.categoryId,
    minAllocation: norm.minAllocation.value.toString(),
    maxAllocation: norm.maxAllocation.value.toString(),
    targetAllocation: norm.targetAllocation.value.toString(),
    createdAt: norm.createdAt,
    updatedAt: norm.updatedAt,
  };
}

/**
 * Maps a `NormsPortfolios` entity to its public DTO representation.
 *
 * @param relation - The norms-portfolios entity.
 * @returns The norms-portfolios DTO.
 */
export function toNormsPortfoliosDto(
  relation: NormsPortfolios,
): NormsPortfoliosDto {
  return {
    id: relation.id as EntityId,
    normId: relation.normId,
    portfolioId: relation.portfolioId,
    minAllocation: relation.minAllocation.value.toString(),
    maxAllocation: relation.maxAllocation.value.toString(),
    targetAllocation: relation.targetAllocation.value.toString(),
    createdAt: relation.createdAt,
  };
}
