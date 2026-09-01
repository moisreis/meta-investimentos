import { eq, inArray } from "drizzle-orm";

import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { bankAccount } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IBankAccount}
 * contract.
 *
 * Maps `bank_account` rows to `BankAccount` entities and back. Lookups
 * rely on the primary key, the portfolio index and the bank index.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class BankAccountRepository implements IBankAccount {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `BankAccountRepository` bound to the provided database
   * client.
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
   * Maps the provided `bank_account` row to a {@link BankAccount}
   * entity.
   *
   * @param row - The database row.
   * @returns The hydrated `BankAccount` entity.
   */
  private toEntity(row: typeof bankAccount.$inferSelect): BankAccount {
    return BankAccount.create(
      {
        portfolioId: EntityId.create(row.portfolioId),
        bankId: EntityId.create(row.bankId),
        agency: row.agency,
        accountNumber: row.accountNumber,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `bank_account`
   * table.
   *
   * @param entity - The bank account to persist.
   * @returns The insert values.
   */
  private toInsert(entity: BankAccount): typeof bankAccount.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      bankId: entity.bankId,
      agency: entity.agency,
      accountNumber: entity.accountNumber,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `bank_account` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The bank account to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: BankAccount,
  ): Partial<typeof bankAccount.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      bankId: entity.bankId,
      agency: entity.agency,
      accountNumber: entity.accountNumber,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the bank account with the provided id.
   *
   * @see {@link IBankAccount.findById}
   */
  async findById(id: string): Promise<BankAccount | null> {
    const [row] = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all bank accounts belonging to the provided portfolio id.
   *
   * @see {@link IBankAccount.findAllByPortfolioId}
   */
  async findAllByPortfolioId(portfolioId: string): Promise<BankAccount[]> {
    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.portfolioId, portfolioId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all bank accounts belonging to any of the provided
   * portfolio ids.
   *
   * Batched lookup for hydrating bank accounts across many portfolios
   * without falling into an N+1 query pattern.
   *
   * @param portfolioIds - The ids of the portfolios to retrieve bank
   *   accounts for.
   * @returns A promise resolving to the matching `BankAccount`
   *   entities.
   */
  async findAllByPortfolioIds(portfolioIds: string[]): Promise<BankAccount[]> {
    if (portfolioIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.portfolioId, portfolioIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all bank accounts belonging to the provided bank id.
   *
   * @see {@link IBankAccount.findAllByBankId}
   */
  async findAllByBankId(bankId: string): Promise<BankAccount[]> {
    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(eq(bankAccount.bankId, bankId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all bank accounts belonging to any of the provided bank
   * ids.
   *
   * Batched lookup for hydrating bank accounts across many banks
   * without falling into an N+1 query pattern.
   *
   * @param bankIds - The ids of the banks to retrieve bank accounts
   *   for.
   * @returns A promise resolving to the matching `BankAccount`
   *   entities.
   */
  async findAllByBankIds(bankIds: string[]): Promise<BankAccount[]> {
    if (bankIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(bankAccount)
      .where(inArray(bankAccount.bankId, bankIds));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided bank account.
   *
   * @see {@link IBankAccount.save}
   */
  async save(persisted: BankAccount): Promise<BankAccount> {
    if (persisted.id) {
      const [row] = await this.db
        .update(bankAccount)
        .set(this.toUpdate(persisted))
        .where(eq(bankAccount.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`BankAccount with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(bankAccount)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the bank account with the provided id.
   *
   * @see {@link IBankAccount.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(bankAccount).where(eq(bankAccount.id, id));
  }
}
