import { IStatement } from "@domain/statement/interfaces/statement.interface"
import { EntityId } from "@/value-objects"
import type { StatementResponseDTO } from "../dto/statement-response.dto"
import { toResponseDTO } from "../mappers/statement.mapper"

export interface ListStatementsInput {
  portfolioId: string
}

/**
 * @summary
 * Lists the `Statement` entries of a portfolio.
 *
 * @remarks
 * Uses the portfolio id to scope the statement query.
 *
 * @explanation
 * Use this use case to list the statements of a given
 * portfolio through the service layer.
 *
 * @example
 * const STATEMENTS = await LIST_STATEMENTS_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListStatementsUseCase {
  constructor(private statementRepository: IStatement) {}

  /**
   * @summary
   * Fetches all statements of the provided portfolio.
   *
   * @remarks
   * Uses the portfolio id to scope the statement query.
   *
   * @explanation
   * Use this method to list the statements of a given
   * portfolio through the service layer.
   *
   * @param input - Payload with the target portfolio id.
   *
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await LIST_STATEMENTS_USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListStatementsInput
  ): Promise<StatementResponseDTO[]> {
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const STATEMENTS =
      await this.statementRepository.findAllByPortfolioId(
        PORTFOLIO_ID
      )
    return STATEMENTS.map(toResponseDTO)
  }
}
