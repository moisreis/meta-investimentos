import type { Account } from "@/business/entities/user/account.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `Account` entities.
 *
 * An `IAccount`:
 * - persists accounts through {@link IAccount.save}.
 * - retrieves accounts by id, issuer and account id, and user id.
 * - removes accounts by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Account` entities and back.
 */
export interface IAccount {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the account with the provided id.
   *
   * @param id - The unique identifier of the account.
   * @returns A promise resolving to the `Account` or `null` when
   * not found.
   */
  findById(id: string): Promise<Account | null>;

  /**
   * Retrieves the account linked to the provided issuer and account id.
   *
   * @param issuer - The issuer of the account.
   * @param accountId - The account id provided by the issuer.
   * @returns A promise resolving to the `Account` or `null` when
   * not found.
   */
  findByIssuerAndAccountId(
    issuer: string,
    accountId: string,
  ): Promise<Account | null>;

  /**
   * Retrieves all accounts belonging to the provided user id.
   *
   * @param userId - The id of the user the accounts belong to.
   * @returns A promise resolving to all matching `Account` entities.
   */
  findAllByUserId(userId: string): Promise<Account[]>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided account.
   *
   * When the account has no id, the implementation inserts a new
   * record and the persisted `Account` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param account - The account to persist.
   * @returns A promise resolving to the persisted `Account`.
   */
  save(account: Account): Promise<Account>;

  /**
   * Removes the account with the provided id.
   *
   * @param id - The unique identifier of the account.
   * @returns A promise that resolves when the account is removed.
   */
  delete(id: string): Promise<void>;
}
