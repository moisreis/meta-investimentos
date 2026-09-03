import { ID } from "@/__tests__/__fixtures__/_ids";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { TransactionAllocation } from "@/business/entities";
import { TransactionAllocation as TransactionAllocationEntity } from "@/business/entities/portfolio/transaction-allocation.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { transactionAllocation } from "@/infrastructure/database/schemas";
import { seedTransactionContext } from "./_transaction.seed";

/**
 * Represents the default transaction allocation identifier
 * for test fixtures.
 */
export const TRANSACTION_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.DEFAULT;

/**
 * Represents an alternate transaction allocation identifier
 * for test fixtures.
 */
export const OTHER_TRANSACTION_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.OTHER;

/**
 * Represents a second transaction allocation identifier for
 * test fixtures that involve multiple allocations.
 */
export const SECOND_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.SECOND;

/**
 * Represents a default transaction allocation fixture.
 * The allocation links the default application to the default
 * withdrawal. It consumes `3.0` quota quantities.
 */
export const TRANSACTION_ALLOCATION = TransactionAllocationEntity.create(
  {
    applicationId: EntityId.create(ID.APPLICATION.DEFAULT),
    withdrawId: EntityId.create(ID.WITHDRAWAL.DEFAULT),
    quotasConsumed: QuotaQuantity.create("3.0"),
  },
  ID.TRANSACTION_ALLOCATION.DEFAULT,
);

/**
 * Represents an alternate transaction allocation fixture.
 * The allocation links the alternate application to the
 * alternate withdrawal. It consumes `2.0` quota quantities.
 */
export const OTHER_TRANSACTION_ALLOCATION = TransactionAllocationEntity.create(
  {
    applicationId: EntityId.create(ID.APPLICATION.OTHER),
    withdrawId: EntityId.create(ID.WITHDRAWAL.OTHER),
    quotasConsumed: QuotaQuantity.create("2.0"),
  },
  ID.TRANSACTION_ALLOCATION.OTHER,
);

/**
 * Represents a second transaction allocation fixture.
 * The allocation links the default application to the
 * alternate withdrawal. It consumes `1.5` quota quantities.
 */
export const SECOND_ALLOCATION = TransactionAllocationEntity.create(
  {
    applicationId: EntityId.create(ID.APPLICATION.DEFAULT),
    withdrawId: EntityId.create(ID.WITHDRAWAL.OTHER),
    quotasConsumed: QuotaQuantity.create("1.5"),
  },
  ID.TRANSACTION_ALLOCATION.SECOND,
);

/**
 * Represents a fresh transaction allocation fixture.
 * The fixture has no persisted ID. It links the alternate
 * application to the default withdrawal with `2.5` consumed
 * quota quantities.
 */
export const FRESH_ALLOCATION = TransactionAllocationEntity.create({
  applicationId: EntityId.create(ID.APPLICATION.OTHER),
  withdrawId: EntityId.create(ID.WITHDRAWAL.DEFAULT),
  quotasConsumed: QuotaQuantity.create("2.5"),
});

/**
 * Represents an updated transaction allocation fixture.
 * The fixture uses the default allocation ID but has
 * increased consumed quotas of `3.5`.
 */
export const UPDATED_TRANSACTION_ALLOCATION =
  TransactionAllocationEntity.create(
    {
      applicationId: EntityId.create(ID.APPLICATION.DEFAULT),
      withdrawId: EntityId.create(ID.WITHDRAWAL.DEFAULT),
      quotasConsumed: QuotaQuantity.create("3.5"),
    },
    ID.TRANSACTION_ALLOCATION.DEFAULT,
  );

/**
 * Represents the sum of consumed quota quantities across the
 * default and alternate allocations. Equals `4.5`.
 */
export const CONSUMED_QUOTAS_SUM = QuotaQuantity.create("4.5");

/**
 * Seeds the default and alternate transaction allocations
 * into the database.
 *
 * The function first seeds the transaction context to ensure
 * related application and withdrawal rows exist. It then
 * inserts both allocation rows.
 *
 * @returns An array containing the default and alternate
 *          {@link TransactionAllocation} fixtures.
 */
export async function seedAllocations(): Promise<TransactionAllocation[]> {
  await seedTransactionContext();

  for (const fixture of [
    TRANSACTION_ALLOCATION,
    OTHER_TRANSACTION_ALLOCATION,
  ]) {
    await db.insert(transactionAllocation).values({
      id: fixture.id,
      applicationId: fixture.applicationId,
      withdrawId: fixture.withdrawId,
      quotasConsumed: fixture.quotasConsumed.value.toString(),
      createdAt: fixture.createdAt,
    });
  }

  return [TRANSACTION_ALLOCATION, OTHER_TRANSACTION_ALLOCATION];
}

/**
 * Seeds all transaction allocation fixtures into the database.
 *
 * The function first seeds the transaction context to ensure
 * related application and withdrawal rows exist. It then
 * inserts the default, alternate, and second allocations.
 *
 * @returns The full array of {@link TransactionAllocation}
 *          fixtures.
 */
export async function seedAllAllocations(): Promise<TransactionAllocation[]> {
  await seedTransactionContext();

  for (const fixture of [
    TRANSACTION_ALLOCATION,
    OTHER_TRANSACTION_ALLOCATION,
    SECOND_ALLOCATION,
  ]) {
    await db.insert(transactionAllocation).values({
      id: fixture.id,
      applicationId: fixture.applicationId,
      withdrawId: fixture.withdrawId,
      quotasConsumed: fixture.quotasConsumed.value.toString(),
      createdAt: fixture.createdAt,
    });
  }

  return [
    TRANSACTION_ALLOCATION,
    OTHER_TRANSACTION_ALLOCATION,
    SECOND_ALLOCATION,
  ];
}
