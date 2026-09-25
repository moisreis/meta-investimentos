import type { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"

export interface ListFundRowSummariesInput {
  fundIds: string[]
}

export interface FundRowSummaryDTO {
  fundId: string
  positionCount: number
}

/**
 * @summary
 * Summarizes the holdings of a set of funds.
 *
 * @remarks
 * Runs a single grouped query over the `position`
 * rows so no rows are materialized.
 *
 * @explanation
 * Use this use case whenever a loader needs the
 * derived count of positions linked to each fund.
 * The fund repository stays untouched; this service
 * composes the count into one payload.
 *
 * @example
 * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
 *   fundIds: ["fund-1", "fund-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListFundRowSummariesUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Tallies the positions of each fund.
   *
   * @remarks
   * Returns an entry only for funds that matched at
   * least one row; callers fall back to zero when a
   * fund is absent from the result.
   *
   * @explanation
   * Use this method to resolve the derived position
   * counts of a fund list in a single service call.
   *
   * @param input - Payload with the fund ids.
   *
   * @returns The per-fund position summaries.
   *
   * @example
   * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
   *   fundIds: ["fund-1", "fund-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListFundRowSummariesInput
  ): Promise<FundRowSummaryDTO[]> {
    if (input.fundIds.length === 0) {
      return []
    }

    const IDS = input.fundIds.map((id) => EntityId.create(id))
    const COUNTS =
      await this.positionRepository.countByFundIds(IDS)

    return COUNTS.map((entry) => ({
      fundId: entry.fundId as string,
      positionCount: entry.count,
    }))
  }
}
