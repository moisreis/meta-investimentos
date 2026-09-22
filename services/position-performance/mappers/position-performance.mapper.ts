import { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import type { PositionPerformanceResponseDTO } from "../dto/position-performance-response.dto"

/**
 * @summary
 * Maps a `PositionPerformance` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The position performance domain entity.
 *
 * @returns Transport response DTO.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toResponseDTO(
  entity: PositionPerformance
): PositionPerformanceResponseDTO {
  return {
    id: entity.id as string,
    positionId: entity.positionId,
    date: entity.date.toISOString(),
    quotasHeld: entity.quotasHeld.value.toString(),
    patrimony: entity.patrimony.value.toString(),
    applicationTotal: entity.applicationTotal.value.toString(),
    redemptionTotal: entity.redemptionTotal.value.toString(),
    cashFlowNet: entity.cashFlowNet.value.toString(),
    earnings: entity.earnings.value.toString(),
    returnDaily: entity.returnDaily.value.toString(),
    returnMonthly: entity.returnMonthly
      ? entity.returnMonthly.value.toString()
      : null,
    returnYearly: entity.returnYearly
      ? entity.returnYearly.value.toString()
      : null,
    returnLast12m: entity.returnLast12m
      ? entity.returnLast12m.value.toString()
      : null,
    allocation: entity.allocation.value.toString(),
    createdAt: entity.createdAt.toISOString(),
  }
}
