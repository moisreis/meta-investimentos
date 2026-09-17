import {
  NormsPortfolios,
  type NormsPortfoliosProps,
} from "@domain/norms-portfolio/entities/norms-portfolios.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { CreateNormPortfolioDTO } from "../dto/create-norm-portfolio.dto"
import type { NormPortfolioResponseDTO } from "../dto/norm-portfolio-response.dto"

/**
 * @summary
 * Maps a create `NormsPortfolios` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `NormsPortfolios.create`.
 */
export function toCreateNormsPortfoliosProps(
  dto: CreateNormPortfolioDTO
): NormsPortfoliosProps {
  return {
    normId: EntityId.create(dto.normId),
    portfolioId: EntityId.create(dto.portfolioId),
    minAllocation: SignedPercentage.create(dto.minAllocation),
    maxAllocation: SignedPercentage.create(dto.maxAllocation),
    targetAllocation: SignedPercentage.create(dto.targetAllocation),
  }
}

/**
 * @summary
 * Maps a `NormsPortfolios` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The norm-portfolio domain entity.
 * @returns Transport response DTO.
 */
export function toResponseDTO(
  entity: NormsPortfolios
): NormPortfolioResponseDTO {
  return {
    id: entity.id as string,
    normId: entity.normId,
    portfolioId: entity.portfolioId,
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    createdAt: entity.createdAt.toISOString(),
  }
}
