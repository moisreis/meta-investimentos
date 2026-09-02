import {
  CONSUMED_QUOTAS_SUM,
  FRESH_ALLOCATION,
  OTHER_TRANSACTION_ALLOCATION,
  OTHER_TRANSACTION_ALLOCATION_ID,
  SECOND_ALLOCATION,
  SECOND_ALLOCATION_ID,
  TRANSACTION_ALLOCATION,
  TRANSACTION_ALLOCATION_ID,
  UPDATED_TRANSACTION_ALLOCATION,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { TransactionAllocation } from "@/business/entities";
import { transactionAllocation } from "@/infrastructure/database/schemas";
import { seedTransactionContext } from "./_transaction.seed";

export {
  TRANSACTION_ALLOCATION_ID,
  OTHER_TRANSACTION_ALLOCATION_ID,
  SECOND_ALLOCATION_ID,
  TRANSACTION_ALLOCATION,
  OTHER_TRANSACTION_ALLOCATION,
  SECOND_ALLOCATION,
  FRESH_ALLOCATION,
  UPDATED_TRANSACTION_ALLOCATION,
  CONSUMED_QUOTAS_SUM,
};

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
