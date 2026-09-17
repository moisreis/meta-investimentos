import { Quota } from "@domain/quota/entities/quota.entity"
import type { QuotaResponseDTO } from "../dto/quota-response.dto"

/**
 * @summary
 * Maps a `Quota` entity into a response DTO.
 *
 * @remarks
 * Serializes the quota price to a decimal string and
 * dates to ISO 8601 strings.
 *
 * @param entity - The quota domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Quota): QuotaResponseDTO {
  return {
    id: entity.id as string,
    fundId: entity.fundId,
    date: entity.date.toISOString(),
    price: entity.price.value.toString(),
    createdAt: entity.createdAt.toISOString(),
  }
}
