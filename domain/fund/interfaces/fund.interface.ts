import type { Fund } from "@domain/fund/entities/fund.entity";
import type { EntityId } from "@/value-objects";

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
   * @returns The entry or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Fund | null>;

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
   * @returns The entry or `null`.
   *
   * @example
   * const FUND = await FUND_REPO.findByCnpj(CNPJ);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByCnpj(cnpj: string): Promise<Fund | null>;

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
   * @returns The matching entries.
   *
   * @example
   * const FUNDS = await FUND_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Fund[]>;

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
   * @returns The persisted entry.
   *
   * @example
   * const FUND = await FUND_REPO.save(NEW_FUND);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(fund: Fund): Promise<Fund>;

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
   * @returns Resolves when removed.
   *
   * @example
   * await FUND_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}
