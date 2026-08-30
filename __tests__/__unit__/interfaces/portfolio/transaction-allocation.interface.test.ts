import { beforeEach, describe, expect, it } from "vitest";

import {
  ALLOCATION,
  ALLOCATION_ID,
  APPLICATION_ID,
  createInMemoryTransactionAllocationRepository,
  OTHER_APPLICATION_ID,
  OTHER_WITHDRAW_ID,
  WITHDRAW_ID,
} from "@/__tests__/__helpers__/interfaces/_transaction-allocation.test.helper";

import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("ITransactionAllocation", () => {
  let REPOSITORY: ITransactionAllocation;

  beforeEach(() => {
    REPOSITORY = createInMemoryTransactionAllocationRepository();
  });

  describe("findById", () => {
    it("returns the persisted transaction allocation", async () => {
      await REPOSITORY.save(ALLOCATION);

      const FOUND = await REPOSITORY.findById(ALLOCATION_ID);

      expect(FOUND?.equals(ALLOCATION)).toBe(true);
    });

    it("returns null when the transaction allocation does not exist", async () => {
      expect(await REPOSITORY.findById(ALLOCATION_ID)).toBeNull();
    });
  });

  describe("findAllByApplicationId", () => {
    it("returns all persisted allocations for the application", async () => {
      const SECOND_ALLOCATION = TransactionAllocation.create(
        {
          applicationId: APPLICATION_ID,
          withdrawId: OTHER_WITHDRAW_ID,
          quotasConsumed: QuotaQuantity.create("2.5"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_ALLOCATION = TransactionAllocation.create(
        {
          applicationId: OTHER_APPLICATION_ID,
          withdrawId: WITHDRAW_ID,
          quotasConsumed: QuotaQuantity.create("3.75"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(ALLOCATION);
      await REPOSITORY.save(SECOND_ALLOCATION);
      await REPOSITORY.save(OTHER_ALLOCATION);

      const FOUND = await REPOSITORY.findAllByApplicationId(APPLICATION_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(ALLOCATION)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_ALLOCATION)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByApplicationId(APPLICATION_ID)).toEqual(
        [],
      );
    });
  });

  describe("findAllByWithdrawalId", () => {
    it("returns all persisted allocations for the withdrawal", async () => {
      const SECOND_ALLOCATION = TransactionAllocation.create(
        {
          applicationId: OTHER_APPLICATION_ID,
          withdrawId: WITHDRAW_ID,
          quotasConsumed: QuotaQuantity.create("3.75"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_ALLOCATION = TransactionAllocation.create(
        {
          applicationId: APPLICATION_ID,
          withdrawId: OTHER_WITHDRAW_ID,
          quotasConsumed: QuotaQuantity.create("2.5"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(ALLOCATION);
      await REPOSITORY.save(SECOND_ALLOCATION);
      await REPOSITORY.save(OTHER_ALLOCATION);

      const FOUND = await REPOSITORY.findAllByWithdrawalId(WITHDRAW_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(ALLOCATION)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_ALLOCATION)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByWithdrawalId(WITHDRAW_ID)).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new transaction allocation", async () => {
      await REPOSITORY.save(ALLOCATION);

      const FOUND = await REPOSITORY.findById(ALLOCATION_ID);

      expect(FOUND?.equals(ALLOCATION)).toBe(true);
    });

    it("updates an existing transaction allocation", async () => {
      await REPOSITORY.save(ALLOCATION);

      const UPDATED = TransactionAllocation.create(
        {
          applicationId: APPLICATION_ID,
          withdrawId: OTHER_WITHDRAW_ID,
          quotasConsumed: QuotaQuantity.create("1.25"),
        },
        ALLOCATION_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(ALLOCATION_ID);

      expect(FOUND?.withdrawId).toBe(OTHER_WITHDRAW_ID);
    });
  });

  describe("delete", () => {
    it("removes the persisted transaction allocation", async () => {
      await REPOSITORY.save(ALLOCATION);

      await REPOSITORY.delete(ALLOCATION_ID);

      expect(await REPOSITORY.findById(ALLOCATION_ID)).toBeNull();
    });
  });
});
