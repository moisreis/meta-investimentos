import { ID } from "@/__tests__/__fixtures__/_ids";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { TransactionAllocation as TransactionAllocationEntity } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/** Represents the default transaction allocation identifier. */
export const TRANSACTION_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.DEFAULT;

/** Represents the secondary transaction allocation identifier. */
export const OTHER_TRANSACTION_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.OTHER;

/** Represents a second allocation identifier for the same application. */
export const SECOND_ALLOCATION_ID = ID.TRANSACTION_ALLOCATION.SECOND;

/** Represents the default application identifier. */
export const APPLICATION_ID = ID.APPLICATION.DEFAULT;

/** Represents the secondary application identifier. */
export const OTHER_APPLICATION_ID = ID.APPLICATION.OTHER;

/** Represents the default withdrawal identifier. */
export const WITHDRAWAL_ID = ID.WITHDRAWAL.DEFAULT;

/** Represents the secondary withdrawal identifier. */
export const OTHER_WITHDRAWAL_ID = ID.WITHDRAWAL.OTHER;

/**
 * Represents the default transaction allocation fixture.
 *
 * The fixture allocates `3.0` quota quantities from the
 * default application to the default withdrawal.
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
 * Represents a secondary transaction allocation fixture.
 *
 * The fixture allocates `2.0` quota quantities from the
 * secondary application to the secondary withdrawal.
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
 * Represents a second allocation for the same application.
 *
 * The fixture allocates `1.5` quota quantities from the
 * default application to the secondary withdrawal.
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
 * Represents a fresh allocation fixture without a fixed ID.
 *
 * The fixture is useful for create-and-save tests where the
 * repository assigns the identifier.
 */
export const FRESH_ALLOCATION = TransactionAllocationEntity.create({
  applicationId: EntityId.create(ID.APPLICATION.OTHER),
  withdrawId: EntityId.create(ID.WITHDRAWAL.DEFAULT),
  quotasConsumed: QuotaQuantity.create("2.5"),
});

/**
 * Represents the default allocation fixture after update.
 *
 * The fixture has a higher `quotasConsumed` value of `3.5`
 * to simulate a mutation of the original allocation.
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
 * Represents the expected sum of consumed quota quantities
 * across the default, secondary, and second allocations.
 */
export const CONSUMED_QUOTAS_SUM = QuotaQuantity.create("4.5");

/**
 * Alias for {@link TRANSACTION_ALLOCATION_ID}.
 * Provides a shorter name for local test readability.
 */
export const ALLOCATION_ID = TRANSACTION_ALLOCATION_ID;

/**
 * Alias for {@link TRANSACTION_ALLOCATION}.
 * Provides a shorter name for local test readability.
 */
export const ALLOCATION = TRANSACTION_ALLOCATION;

/**
 * Alias for {@link WITHDRAWAL_ID}.
 * Provides a shorter name for local test readability.
 */
export const WITHDRAW_ID = WITHDRAWAL_ID;

/**
 * Alias for {@link OTHER_WITHDRAWAL_ID}.
 * Provides a shorter name for local test readability.
 */
export const OTHER_WITHDRAW_ID = OTHER_WITHDRAWAL_ID;

/**
 * Creates an in-memory implementation of the
 * {@link ITransactionAllocation} repository.
 *
 * The repository stores {@link TransactionAllocationEntity}
 * instances in memory. It supports finding by ID, finding
 * all by application ID, finding all by withdrawal ID,
 * saving, and deleting.
 *
 * @returns A fresh {@link ITransactionAllocation} instance
 *          backed by an in-memory store.
 */
export function createInMemoryTransactionAllocationRepository(): ITransactionAllocation {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<ITransactionAllocation["save"]>>
  >({ extractId: (ta) => ta.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByApplicationId(applicationId) {
      return BASE.match((ta) => ta.applicationId === applicationId);
    },
    async findAllByWithdrawalId(withdrawId) {
      return BASE.match((ta) => ta.withdrawId === withdrawId);
    },
    save: (transactionAllocation) => BASE.save(transactionAllocation),
    delete: (id) => BASE.delete(id),
  };
}
