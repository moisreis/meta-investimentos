import {
  Portfolio,
  type PortfolioProps,
} from "@domain/portfolio/entities/portfolio.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { CreatePortfolioDTO } from "../dto/create-portfolio.dto"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"

/**
 * @summary
 * Maps a create `Portfolio` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props accepted by `Portfolio.create`.
 */
export function toCreatePortfolioProps(
  dto: CreatePortfolioDTO
): PortfolioProps {
  return {
    acronym: dto.acronym,
    name: dto.name,
    userId: EntityId.create(dto.userId),
    annualInterestRate: SignedPercentage.create(dto.annualInterestRate),
    minAllocation: SignedPercentage.create(dto.minAllocation),
    maxAllocation: SignedPercentage.create(dto.maxAllocation),
    targetAllocation: SignedPercentage.create(dto.targetAllocation),
  }
}

/**
 * @summary
 * Maps a `Portfolio` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The portfolio domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Portfolio): PortfolioResponseDTO {
  return {
    id: entity.id as string,
    acronym: entity.acronym,
    name: entity.name,
    userId: entity.userId,
    annualInterestRate: entity.annualInterestRate.value.toString(),
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
