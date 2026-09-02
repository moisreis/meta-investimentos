import {
  APPLICATION_ID,
  CONSUMED_QUOTAS_SUM,
  FRESH_ALLOCATION,
  OTHER_APPLICATION_ID,
  OTHER_TRANSACTION_ALLOCATION,
  OTHER_TRANSACTION_ALLOCATION_ID,
  OTHER_WITHDRAWAL_ID,
  SECOND_ALLOCATION,
  SECOND_ALLOCATION_ID,
  TRANSACTION_ALLOCATION,
  TRANSACTION_ALLOCATION_ID,
  UPDATED_TRANSACTION_ALLOCATION,
  WITHDRAWAL_ID,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";

export {
  TRANSACTION_ALLOCATION_ID,
  OTHER_TRANSACTION_ALLOCATION_ID,
  SECOND_ALLOCATION_ID,
  APPLICATION_ID,
  OTHER_APPLICATION_ID,
  WITHDRAWAL_ID,
  OTHER_WITHDRAWAL_ID,
  TRANSACTION_ALLOCATION,
  OTHER_TRANSACTION_ALLOCATION,
  SECOND_ALLOCATION,
  FRESH_ALLOCATION,
  UPDATED_TRANSACTION_ALLOCATION,
  CONSUMED_QUOTAS_SUM,
};

export const ALLOCATION_ID = TRANSACTION_ALLOCATION_ID;
export const ALLOCATION = TRANSACTION_ALLOCATION;
export const WITHDRAW_ID = WITHDRAWAL_ID;
export const OTHER_WITHDRAW_ID = OTHER_WITHDRAWAL_ID;

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
