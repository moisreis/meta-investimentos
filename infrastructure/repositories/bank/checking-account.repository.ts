import { and, eq, gte, inArray, lte } from "drizzle-orm";

import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import { checkingAccount } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link ICheckingAccount}
 * contract.
 *
 * Maps `checking_account` rows to `CheckingAccount` entities and back.
 * Lookups rely on the primary key and the `(bank_account_id, date)`
 * unique pair and composite index.
 *
 * The `value` column is stored as `numeric`, which postgres returns as
 * a string; it is hydrated into a `SignedMoney` value object and
 * persisted through its `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise.
 *
 * Batch lookups exist so a balance series across several bank accounts
 * is resolved with one query instead of one query per account.
 */
export class CheckingAccountRepository implements ICheckingAccount {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `CheckingAccountRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `checking_account` row to a
   * {@link CheckingAccount} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `CheckingAccount` entity.
   */
  private toEntity(row: typeof checkingAccount.$inferSelect): CheckingAccount {
    return CheckingAccount.create(
      {
        bankAccountId: EntityId.create(row.bankAccountId),
        date: row.date,
        value: SignedMoney.create(row.value),
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `checking_account` table.
   *
   * @param entity - The checking account balance to persist.
   * @returns The insert values.
   */
  private toInsert(
    entity: CheckingAccount,
  ): typeof checkingAccount.$inferInsert {
    return {
      bankAccountId: entity.bankAccountId,
      date: entity.date,
      value: entity.value.value.toString(),
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `checking_account` table.
   *
   * @param entity - The checking account balance to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: CheckingAccount,
  ): Partial<typeof checkingAccount.$inferInsert> {
    return {
      bankAccountId: entity.bankAccountId,
      date: entity.date,
      value: entity.value.value.toString(),
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the checking account balance with the provided id.
   *
   * @see {@link ICheckingAccount.findById}
   */
  async findById(id: string): Promise<CheckingAccount | null> {
    const [row] = await this.db
      .select()
      .from(checkingAccount)
      .where(eq(checkingAccount.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all balances belonging to the provided bank account id.
   *
   * @see {@link ICheckingAccount.findAllByBankAccountId}
   */
  async findAllByBankAccountId(
    bankAccountId: string,
  ): Promise<CheckingAccount[]> {
    const rows = await this.db
      .select()
      .from(checkingAccount)
      .where(eq(checkingAccount.bankAccountId, bankAccountId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all balances belonging to any of the provided bank
   * account ids.
   *
   * Batched lookup for hydrating the balance series of many bank
   * accounts without falling into an N+1 query pattern.
   *
   * @param bankAccountIds - The ids of the bank accounts to retrieve
   *   balances for.
   * @returns A promise resolving to the matching `CheckingAccount`
   *   entities.
   */
  async findAllByBankAccountIds(
    bankAccountIds: string[],
  ): Promise<CheckingAccount[]> {
    if (bankAccountIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(checkingAccount)
      .where(inArray(checkingAccount.bankAccountId, bankAccountIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all balances of the provided bank accounts whose date
   * falls within the provided period, inclusive.
   *
   * Batched lookup backing the same analysis as the single-account
   * period lookup across several accounts in one round-trip.
   *
   * @param bankAccountIds - The ids of the bank accounts to retrieve
   *   balances for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `CheckingAccount`
   *   entities.
   */
  async findAllByBankAccountIdsInPeriod(
    bankAccountIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<CheckingAccount[]> {
    if (bankAccountIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(checkingAccount)
      .where(
        and(
          inArray(checkingAccount.bankAccountId, bankAccountIds),
          gte(checkingAccount.date, startDate),
          lte(checkingAccount.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the balance of the provided bank account on the provided
   * date.
   *
   * @see {@link ICheckingAccount.findByBankAccountIdAndDate}
   */
  async findByBankAccountIdAndDate(
    bankAccountId: string,
    date: Date,
  ): Promise<CheckingAccount | null> {
    const [row] = await this.db
      .select()
      .from(checkingAccount)
      .where(
        and(
          eq(checkingAccount.bankAccountId, bankAccountId),
          eq(checkingAccount.date, date),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided checking account balance.
   *
   * @see {@link ICheckingAccount.save}
   */
  async save(persisted: CheckingAccount): Promise<CheckingAccount> {
    if (persisted.id) {
      const [row] = await this.db
        .update(checkingAccount)
        .set(this.toUpdate(persisted))
        .where(eq(checkingAccount.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(
          `CheckingAccount with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(checkingAccount)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the checking account balance with the provided id.
   *
   * @see {@link ICheckingAccount.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(checkingAccount).where(eq(checkingAccount.id, id));
  }
}
