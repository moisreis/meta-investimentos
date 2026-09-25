import type { Fund } from "@domain/fund/entities/fund.entity"
import type { CNPJ, EntityId } from "@/value-objects"

// Count of fund rows linked to a category.
export interface CategoryRowCount {
  // The unique identifier of the category.
  categoryId: EntityId

  // The number of linked fund rows.
  count: number
}

/**
 * @summary
 * Defines the repository contract for `Fund` entities.
 *
 * @remarks
 * An `IFund` persists, retrieves, and removes funds.
 * Supports lookup by id and cnpj.
 *
 * @explanation
 * Use this interface to implement data access for funds.
 * Persistence implementations map rows to `Fund` entities.
 *
 * @example
 * const FUND = await FUND_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IFund {
  /**
   * @summary
   * Retrieves the fund with the provided id.
   *
   * @remarks
   * Returns null when no fund matches.
   *
   * @explanation
   * Use this method to look up a single fund by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the fund.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Fund | null>

  /**
   * @summary
   * Retrieves the fund with the provided cnpj.
   *
   * @remarks
   * Returns null when no fund matches.
   *
   * @explanation
   * Use this method to look up a fund by its
   * corporate registration number. Callers check null
   * for existence.
   *
   * @param cnpj - The cnpj of the fund.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findByCnpj(CNPJ);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByCnpj(cnpj: CNPJ): Promise<Fund | null>

  /**
   * @summary
   * Retrieves all funds, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all funds. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum funds to return.
   * @param options.offset - Starting offset.
   *
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Fund[]>

  /**
   * @summary
   * Retrieves all funds with the provided ids.
   *
   * @remarks
   * Returns an empty array when no funds match.
   *
   * @explanation
   * Use this method to fetch multiple funds by their
   * unique identifiers. Returns an empty array for
   * no matches.
   *
   * @param ids - The unique identifiers of the funds.
   *
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<Fund[]>

  /**
   * @summary
   * Retrieves all funds belonging to the provided bank.
   *
   * @remarks
   * Returns an empty array when no funds match.
   *
   * @explanation
   * Use this method to list funds linked to a bank.
   * Returns an empty array for no matches.
   *
   * @param bankId - The id of the bank.
   *
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByBankId(BANK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByBankId(bankId: EntityId): Promise<Fund[]>

  /**
   * @summary
   * Retrieves all funds with the provided benchmark.
   *
   * @remarks
   * Returns an empty array when no funds match.
   *
   * @explanation
   * Use this method to list funds that track a given
   * benchmark. Returns an empty array for no matches.
   *
   * @param benchmarkId - The id of the benchmark.
   *
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByBenchmarkId(BENCHMARK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByBenchmarkId(benchmarkId: EntityId): Promise<Fund[]>

  /**
   * @summary
   * Retrieves all funds in the provided category.
   *
   * @remarks
   * Returns an empty array when no funds match.
   *
   * @explanation
   * Use this method to list funds belonging to a
   * category. Returns an empty array for no matches.
   *
   * @param categoryId - The id of the category.
   *
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO
   *   .findAllByCategoryId(CATEGORY_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByCategoryId(categoryId: EntityId): Promise<Fund[]>

  /**
   * @summary
   * Counts the fund rows linked to each provided category.
   *
   * @remarks
   * Returns an entry per matched category and an empty
   * array when the input is empty. Categories without
   * funds are absent from the result.
   *
   * @explanation
   * Use this method to tally funds through a single
   * grouped query instead of hydrating every row.
   *
   * @param categoryIds - The identifiers of the categories.
   *
   * @returns The fund count per category.
   *
   * @example
   * const COUNTS = await FUND_REPO
   *   .countByCategoryIds(CATEGORY_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  countByCategoryIds(
    categoryIds: EntityId[]
  ): Promise<CategoryRowCount[]>

  /**
   * @summary
   * Persists the provided fund.
   *
   * @remarks
   * Inserts a new record when the fund has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a fund record.
   * The persisted entity with its id is returned.
   *
   * @param fund - The fund to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const FUND = await FUND_REPO.save(NEW_FUND);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(fund: Fund): Promise<Fund>

  /**
   * @summary
   * Removes the fund with the provided id.
   *
   * @remarks
   * Resolves when the fund is removed.
   *
   * @explanation
   * Use this method to delete a fund record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the fund.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await FUND_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>

  /**
   * @summary
   * Removes the funds with the provided ids.
   *
   * @remarks
   * Resolves when the rows are removed.
   *
   * @explanation
   * Use this method to delete many funds in one
   * batched operation.
   *
   * @param ids - The unique identifiers of the funds.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await FUND_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  deleteByIds(ids: EntityId[]): Promise<void>
}
