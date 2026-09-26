import { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"

/**
 * @summary
 * Maps a `PortfolioPerformance` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The portfolio performance domain entity.
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
  entity: PortfolioPerformance
): PortfolioPerformanceResponseDTO {
  return {
    id: entity.id as string,
    portfolioId: entity.portfolioId,
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
    target: entity.target
      ? entity.target.value.toString()
      : null,
    cumulativeTarget: entity.cumulativeTarget
      ? entity.cumulativeTarget.value.toString()
      : null,
    inflationSpread: entity.inflationSpread
      ? entity.inflationSpread.value.toString()
      : null,
    riskFreeSpread: entity.riskFreeSpread
      ? entity.riskFreeSpread.value.toString()
      : null,
    marketSpread: entity.marketSpread
      ? entity.marketSpread.value.toString()
      : null,
    createdAt: entity.createdAt.toISOString(),
  }
}
