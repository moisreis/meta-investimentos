import { maskPercentage } from "@/presentation/masks/percentage.mask"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import type { PortfolioFormInputValues } from "../validations/portfolio-form.validations"

/**
 * @summary
 * Maps a portfolio response DTO into raw form input values.
 *
 * @remarks
 * Keeps the acronym and name as-is and formats the percentage
 * strings with the same mask used by the form inputs, so the
 * prefilled values display exactly as typed values would.
 *
 * @explanation
 * Use to prefill the portfolio form in edit mode.
 *
 * @param dto - Portfolio response payload from the service layer.
 *
 * @returns Raw input values for the portfolio form.
 *
 * @example
 * const INPUT = toPortfolioFormInitialValues(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toPortfolioFormInitialValues(
  dto: PortfolioResponseDTO
): PortfolioFormInputValues {
  return {
    acronym: dto.acronym,
    name: dto.name,
    annualInterestRate: maskPercentage(dto.annualInterestRate),
    minAllocation: maskPercentage(dto.minAllocation),
    targetAllocation: maskPercentage(dto.targetAllocation),
    maxAllocation: maskPercentage(dto.maxAllocation),
  }
}