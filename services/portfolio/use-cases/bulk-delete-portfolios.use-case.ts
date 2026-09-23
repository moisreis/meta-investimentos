import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeletePortfoliosInput {
  portfolioIds: string[]
  /** Owning user id; when provided, only owned rows are removed. */
  userId?: string
}

/**
 * @summary
 * Deletes multiple `Portfolio` records.
 *
 * @remarks
 * Hydrates the portfolios by their ids and removes only the rows
 * the authenticated user owns. Rows that no longer exist or belong
 * to another user are silently skipped.
 *
 * @explanation
 * Use this use case to remove many portfolios of a user through
 * the service layer.
 *
 * @example
 * await BULK_DELETE_PORTFOLIOS_USE_CASE.execute({
 *   portfolioIds: ["portfolio-1", "portfolio-2"],
 *   userId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export class BulkDeletePortfoliosUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Removes the owned portfolios with the provided ids.
   *
   * @remarks
   * Hydrates the portfolios by their ids and removes only the
   * rows the authenticated user owns. Rows that no longer exist
   * or belong to another user are silently skipped.
   *
   * @explanation
   * Use this method to delete many portfolios of a user.
   *
   * @param input - Payload with the target portfolio ids.
   *
   * @returns Resolves when the owned rows are removed.
   *
   * @example
   * await BULK_DELETE_PORTFOLIOS_USE_CASE.execute({
   *   portfolioIds: ["portfolio-1", "portfolio-2"],
   *   userId: "user-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-22
   */
  async execute(input: BulkDeletePortfoliosInput): Promise<void> {
    if (input.portfolioIds.length === 0) {
      return
    }

    const IDS = input.portfolioIds.map((id) => EntityId.create(id))
    const PORTFOLIOS = await this.portfolioRepository.findAllByIds(IDS)

    const OWNED_IDS = PORTFOLIOS.filter(
      (portfolio) => !input.userId || portfolio.userId === input.userId
    )
      .map((portfolio) => portfolio.id)
      .filter((id): id is EntityId => Boolean(id))

    if (OWNED_IDS.length === 0) {
      return
    }

    await this.portfolioRepository.deleteByIds(OWNED_IDS)
  }
}