import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

export const ALLOCATION_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const APPLICATION_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_APPLICATION_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const WITHDRAW_ID = "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52";
export const OTHER_WITHDRAW_ID = "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64";

export const ALLOCATION = TransactionAllocation.create(
  {
    applicationId: EntityId.create(APPLICATION_ID),
    withdrawId: EntityId.create(WITHDRAW_ID),
    quotasConsumed: QuotaQuantity.create("6.123"),
  },
  ALLOCATION_ID,
);

export function createInMemoryTransactionAllocationRepository(): ITransactionAllocation {
  const ROWS = new Map<string, TransactionAllocation>();

  return {
    async findById(id: string): Promise<TransactionAllocation | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByApplicationId(
      applicationId: string,
    ): Promise<TransactionAllocation[]> {
      const MATCHES: TransactionAllocation[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.applicationId === applicationId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findAllByWithdrawalId(
      withdrawId: string,
    ): Promise<TransactionAllocation[]> {
      const MATCHES: TransactionAllocation[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.withdrawId === withdrawId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async save(
      transactionAllocation: TransactionAllocation,
    ): Promise<TransactionAllocation> {
      ROWS.set(
        transactionAllocation.id ?? "generated-id",
        transactionAllocation,
      );

      return transactionAllocation;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
