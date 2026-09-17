import { Fund, type FundProps } from "@domain/fund/entities/fund.entity"
import { CNPJ, EntityId, SignedPercentage } from "@/value-objects"
import type { CreateFundDTO } from "../dto/create-fund.dto"
import type { FundResponseDTO } from "../dto/fund-response.dto"

/**
 * @summary
 * Maps a create `Fund` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `Fund.create`.
 */
export function toCreateFundProps(dto: CreateFundDTO): FundProps {
  return {
    cnpj: CNPJ.create(dto.cnpj),
    name: dto.name,
    administrationFee: dto.administrationFee
      ? SignedPercentage.create(dto.administrationFee)
      : null,
    performanceFee: dto.performanceFee
      ? SignedPercentage.create(dto.performanceFee)
      : null,
    bankId: EntityId.create(dto.bankId),
    benchmarkId: dto.benchmarkId ? EntityId.create(dto.benchmarkId) : null,
    categoryId: dto.categoryId ? EntityId.create(dto.categoryId) : null,
  }
}

/**
 * @summary
 * Maps a `Fund` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to strings and timestamps
 * to ISO 8601 strings. Nulls are preserved.
 *
 * @param entity - The fund domain entity.
 * @returns Response DTO payload.
 */
export function toResponseDTO(entity: Fund): FundResponseDTO {
  return {
    id: entity.id as string,
    cnpj: entity.cnpj.value,
    name: entity.name,
    administrationFee: entity.administrationFee
      ? entity.administrationFee.value.toString()
      : null,
    performanceFee: entity.performanceFee
      ? entity.performanceFee.value.toString()
      : null,
    bankId: entity.bankId,
    benchmarkId: entity.benchmarkId,
    categoryId: entity.categoryId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
