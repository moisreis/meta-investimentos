import { CheckingAccount } from "@domain/checking-account/entities/checking-account.entity"
import { EntityId, SignedMoney } from "@/value-objects"
import { checkingAccount } from "@db-schemas/checking-account.schema"

/**
 * @summary
 * Maps a checking account persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `CheckingAccount` entity from a row of the
 * `checking_account` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const BALANCE = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toDomain(
  row: typeof checkingAccount.$inferSelect
): CheckingAccount {
  return CheckingAccount.create(
    {
      bankAccountId: EntityId.create(row.bankAccountId),
      date: row.date,
      value: SignedMoney.create(row.value),
    },
    row.id
  )
}

/**
 * @summary
 * Maps a checking account domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `checking_account` table.
 *
 * @param entity - Checking account domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const BALANCE = toInsert(BALANCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toInsert(
  entity: CheckingAccount
): typeof checkingAccount.$inferInsert {
  return {
    bankAccountId: entity.bankAccountId,
    date: entity.date,
    value: entity.value.value.toString(),
  }
}

/**
 * @summary
 * Maps a checking account entity into update values.
 *
 * @remarks
 * Schema has no timestamp columns; body is identical
 * to `toInsert`.
 *
 * @explanation
 * Retained for consistency with the insert/update split
 * pattern across all mappers.
 *
 * @param entity - Checking account domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const BALANCE = toUpdate(BALANCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(
  entity: CheckingAccount
): Partial<typeof checkingAccount.$inferInsert> {
  return {
    bankAccountId: entity.bankAccountId,
    date: entity.date,
    value: entity.value.value.toString(),
  }
}
