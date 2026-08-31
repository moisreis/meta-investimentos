import { db } from "@/__tests__/__setup__/_database.setup";
import { TransactionAllocation } from "@/business/entities";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { transactionAllocation } from "@/infrastructure/database/schemas";
import { APPLICATION_ID, OTHER_APPLICATION_ID } from "./_application.seed";
import { seedTransactionContext } from "./_transaction.seed";
import { OTHER_WITHDRAWAL_ID, WITHDRAWAL_ID } from "./_withdrawal.seed";

export const TRANSACTION_ALLOCATION_ID = "92a3b4c5-de0f-4a3b-9c4d-5e6f708192a3";
export const OTHER_TRANSACTION_ALLOCATION_ID =
  "03b4c5d6-ef0a-4b3c-8d4e-6f708192a3b4";
export const SECOND_ALLOCATION_ID = "14c5d6e7-f0ab-4c3d-9e4f-708192a3b4c5";

export const TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: APPLICATION_ID,
    withdrawId: WITHDRAWAL_ID,
    quotasConsumed: QuotaQuantity.create("3.0"),
  },
  TRANSACTION_ALLOCATION_ID,
);

export const OTHER_TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: OTHER_APPLICATION_ID,
    withdrawId: OTHER_WITHDRAWAL_ID,
    quotasConsumed: QuotaQuantity.create("2.0"),
  },
  OTHER_TRANSACTION_ALLOCATION_ID,
);

export const SECOND_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: APPLICATION_ID,
    withdrawId: OTHER_WITHDRAWAL_ID,
    quotasConsumed: QuotaQuantity.create("1.5"),
  },
  SECOND_ALLOCATION_ID,
);

export const FRESH_ALLOCATION = TransactionAllocation.create({
  applicationId: OTHER_APPLICATION_ID,
  withdrawId: WITHDRAWAL_ID,
  quotasConsumed: QuotaQuantity.create("2.5"),
});

export const UPDATED_TRANSACTION_ALLOCATION = TransactionAllocation.create(
  {
    applicationId: APPLICATION_ID,
    withdrawId: WITHDRAWAL_ID,
    quotasConsumed: QuotaQuantity.create("3.5"),
  },
  TRANSACTION_ALLOCATION_ID,
);

export const CONSUMED_QUOTAS_SUM = QuotaQuantity.create("4.5");

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
