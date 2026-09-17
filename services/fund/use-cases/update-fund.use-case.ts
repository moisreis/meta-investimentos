import { IFund } from "@domain/fund/interfaces/fund.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { FundResponseDTO } from "../dto/fund-response.dto"
import { toResponseDTO } from "../mappers/fund.mapper"

export interface UpdateFundInput {
  fundId: string
  name?: string
  administrationFee?: string | null
  performanceFee?: string | null
  benchmarkId?: string | null
  categoryId?: string | null
}

/**
 * @summary
 * Updates an existing `Fund`.
 *
 * @remarks
 * Fetches the fund, applies `update` with the provided
 * fields, and persists the updated entity. Undefined
 * fields are kept; null fields are cleared.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing fund through the service layer.
 *
 * @example
 * const FUND = await UPDATE_FUND_USE_CASE.execute({
 *   fundId: "fund-1",
 *   name: "Fundo Multi Mercado II",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateFundUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Updates and persists a fund.
   *
   * @param input - Payload with the target fund id and
   *                field updates.
   * @returns The updated fund response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdateFundInput): Promise<FundResponseDTO> {
    const ID = EntityId.create(input.fundId)
    const FUND = await this.fundRepository.findById(ID)
    if (!FUND) {
      throw new NotFoundError("`Fund` not found.")
    }
    const UPDATED = FUND.update({
      name: input.name,
      administrationFee:
        input.administrationFee === undefined
          ? undefined
          : input.administrationFee === null
            ? null
            : SignedPercentage.create(input.administrationFee),
      performanceFee:
        input.performanceFee === undefined
          ? undefined
          : input.performanceFee === null
            ? null
            : SignedPercentage.create(input.performanceFee),
      benchmarkId:
        input.benchmarkId === undefined
          ? undefined
          : input.benchmarkId === null
            ? null
            : EntityId.create(input.benchmarkId),
      categoryId:
        input.categoryId === undefined
          ? undefined
          : input.categoryId === null
            ? null
            : EntityId.create(input.categoryId),
    })
    const SAVED = await this.fundRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}