import { Norm, type NormProps } from "@domain/norm/entities/norm.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { CreateNormDTO } from "../dto/create-norm.dto"
import type { NormResponseDTO } from "../dto/norm-response.dto"

/**
 * @summary
 * Maps a create `Norm` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `Norm.create`.
 */
export function toCreateNormProps(dto: CreateNormDTO): NormProps {
  return {
    articleNumber: dto.articleNumber,
    name: dto.name,
    categoryId: EntityId.create(dto.categoryId),
    minAllocation: SignedPercentage.create(dto.minAllocation),
    maxAllocation: SignedPercentage.create(dto.maxAllocation),
    targetAllocation: SignedPercentage.create(dto.targetAllocation),
  }
}

/**
 * @summary
 * Maps a `Norm` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The norm domain entity.
 * @returns Transport response DTO.
 */
export function toResponseDTO(entity: Norm): NormResponseDTO {
  return {
    id: entity.id as string,
    articleNumber: entity.articleNumber,
    name: entity.name,
    categoryId: entity.categoryId,
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
