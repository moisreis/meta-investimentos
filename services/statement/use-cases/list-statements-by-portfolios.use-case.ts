import { IStatement } from "@domain/statement/interfaces/statement.interface"
import { EntityId } from "@/value-objects"
import type { StatementResponseDTO } from "../dto/statement-response.dto"
import { toResponseDTO } from "../mappers/statement.mapper"

export interface ListStatementsByPortfoliosInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists the `Statement` entries of many portfolios.
 *
 * @remarks
 * Batches the lookup through the portfolio ids so the
 * statement registry renders every report of the signed-in
 * user without an N+1 query pattern.
 *
 * @explanation
 * Use this use case to list the statement registry page
 * through the service layer.
 *
 * @example
 * const STATEMENTS = await LIST_STATEMENTS_BY_PORTFOLIOS_USE_CASE
 *   .execute({
 *     portfolioIds: ["portfolio-1", "portfolio-2"],
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListStatementsByPortfoliosUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Fetches the statements of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when the list of ids is empty.
   *
   * @explanation
   * Use this method to hydrate every statement of a set of
   * portfolios in a single repository call.
   *
   * @param input - Payload with the target portfolio ids.
   *
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await LIST_STATEMENTS_BY_PORTFOLIOS_USE_CASE
   *   .execute({
   *     portfolioIds: ["portfolio-1", "portfolio-2"],
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListStatementsByPortfoliosInput
  ): Promise<StatementResponseDTO[]> {
    const IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )
    const STATEMENTS =
      await this.statementRepository.findAllByPortfolioIds(IDS)

    return STATEMENTS.map((statement) =>
      toResponseDTO(statement)
    )
  }
}
