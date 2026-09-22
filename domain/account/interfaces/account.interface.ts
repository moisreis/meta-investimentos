import type { Account } from "@domain/account/entities/account.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Account` entities.
 *
 * @remarks
 * An `IAccount` persists, retrieves, and removes accounts.
 * Supports lookup by id, issuer, account id, and user id.
 *
 * @explanation
 * Use this interface to implement data access for accounts.
 * Persistence implementations map rows to `Account` entities.
 *
 * @example
 * const ACC = await ACCOUNT_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IAccount {
  /**
   * @summary
   * Retrieves the account with the provided id.
   *
   * @remarks
   * Returns null when no account matches.
   *
   * @explanation
   * Use this method to look up a single account by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the account.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const ACC = await ACCOUNT_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Account | null>

  /**
   * @summary
   * Retrieves the account for the provider and account id.
   *
   * @remarks
   * Returns null when no account matches.
   *
   * @explanation
   * Use this method to find a linked external account.
   * The provider and account id identify one unique account.
   *
   * @param providerId - The provider of the account.
   * @param accountId - The account id from the provider.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const ACC = await ACCOUNT_REPO
   *   .findByProviderAndAccountId(PROVIDER_ID, ACCOUNT_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-17
   */
  findByProviderAndAccountId(
    providerId: string,
    accountId: string
  ): Promise<Account | null>

  /**
   * @summary
   * Retrieves all accounts belonging to the provided user.
   *
   * @remarks
   * Returns an empty array when no accounts match.
   *
   * @explanation
   * Use this method to list all accounts linked to a
   * user. Returns an empty array for no matches.
   *
   * @param userId - The id of the user the accounts belong to.
   *
   * @returns The matching entries.
   *
   * @example
   * const ACCTS = await ACCOUNT_REPO.findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByUserId(userId: EntityId): Promise<Account[]>

  /**
   * @summary
   * Retrieves all accounts belonging to the provided user ids.
   *
   * @remarks
   * Returns an empty array when no accounts match.
   *
   * @explanation
   * Use this method to list accounts linked to multiple
   * users at once. Returns an empty array for no matches.
   *
   * @param userIds - The ids of the users the accounts
   *                  belong to.
   * @returns The matching entries.
   *
   * @example
   * const ACCTS = await ACCOUNT_REPO
   *   .findAllByUserIds(USER_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByUserIds(userIds: EntityId[]): Promise<Account[]>

  /**
   * @summary
   * Persists the provided account.
   *
   * @remarks
   * Inserts a new record when the account has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update an account.
   * The persisted entity with its id is returned.
   *
   * @param account - The account to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const ACC = await ACCOUNT_REPO.save(NEW_ACC);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(account: Account): Promise<Account>

  /**
   * @summary
   * Removes the account with the provided id.
   *
   * @remarks
   * Resolves when the account is removed.
   *
   * @explanation
   * Use this method to delete an account record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the account.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await ACCOUNT_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
