import type { IFund } from "@domain/fund/interfaces/fund.interface"
import { EntityId } from "@/value-objects"

export interface ListCategoryRowSummariesInput {
  categoryIds: string[]
}

export interface CategoryRowSummaryDTO {
  categoryId: string
  fundCount: number
}

/**
 * @summary
 * Summarizes the holdings of a set of categories.
 *
 * @remarks
 * Runs a single grouped query over the `fund` rows so
 * no rows are materialized.
 *
 * @explanation
 * Use this use case whenever a loader needs the derived
 * count of funds linked to each category. The category
 * repository stays untouched; this service composes the
 * count into one payload.
 *
 * @example
 * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
 *   categoryIds: ["category-1", "category-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListCategoryRowSummariesUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Tallies the funds of each category.
   *
   * @remarks
   * Returns an entry only for categories that matched
   * at least one row; callers fall back to zero when a
   * category is absent from the result.
   *
   * @explanation
   * Use this method to resolve the derived fund counts
   * of a category list in a single service call.
   *
   * @param input - Payload with the category ids.
   *
   * @returns The per-category fund summaries.
   *
   * @example
   * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
   *   categoryIds: ["category-1", "category-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListCategoryRowSummariesInput
  ): Promise<CategoryRowSummaryDTO[]> {
    const IDS = input.categoryIds.map((id) =>
      EntityId.create(id)
    )

    const FUND_COUNTS =
      await this.fundRepository.countByCategoryIds(IDS)

    return FUND_COUNTS.map((entry) => ({
      categoryId: entry.categoryId as string,
      fundCount: entry.count,
    }))
  }
}
