import type { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"

export interface ListBankAccountsByPortfolioIdsInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists the bank accounts of the provided portfolios.
 *
 * @remarks
 * Fetches every bank account that belongs to one of
 * the provided portfolios, converting the string ids
 * into validated `EntityId` values before querying.
 *
 * @explanation
 * Use this use case to hydrate the bank accounts of
 * many portfolios in a single query, such as tallying
 * the number of accounts linked to each portfolio row.
 *
 * @example
 * const ACCOUNTS = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListBankAccountsByPortfolioIdsUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Fetches the bank accounts of the provided portfolios.
   *
   * @remarks
   * Fetches every bank account that belongs to one of
   * the provided portfolios, converting the string ids
   * into validated `EntityId` values before querying.
   *
   * @explanation
   * Use this method to load the bank accounts of many
   * portfolios at once through the service layer.
   *
   * @param input - The portfolio identifiers.
   *
   * @returns The matching bank accounts.
   *
   * @example
   * const ACCOUNTS = await USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListBankAccountsByPortfolioIdsInput
  ): Promise<BankAccount[]> {
    const PORTFOLIO_IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )
    return this.bankAccountRepository.findAllByPortfolioIds(
      PORTFOLIO_IDS
    )
  }
}
