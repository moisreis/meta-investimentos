import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  CONSUMED_QUOTAS_SUM,
  FRESH_ALLOCATION,
  newTransactionAllocationRepository,
  OTHER_TRANSACTION_ALLOCATION,
  SECOND_ALLOCATION,
  seedAllAllocations,
  seedAllocations,
  TRANSACTION_ALLOCATION,
  TRANSACTION_ALLOCATION_ID,
  UPDATED_TRANSACTION_ALLOCATION,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  APPLICATION_ID,
  OTHER_APPLICATION_ID,
} from "@/__tests__/__seeds__/_application.seed";
import {
  OTHER_WITHDRAWAL_ID,
  WITHDRAWAL_ID,
} from "@/__tests__/__seeds__/_withdrawal.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("TransactionAllocationRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted allocation", async () => {
      await seedAllocations();

      const FOUND = await newTransactionAllocationRepository().findById(
        EntityId.create(TRANSACTION_ALLOCATION_ID),
      );

      expect(FOUND?.equals(TRANSACTION_ALLOCATION)).toBe(true);
    });

    it("returns null when the allocation does not exist", async () => {
      expect(
        await newTransactionAllocationRepository().findById(
          EntityId.create(TRANSACTION_ALLOCATION_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByApplicationId", () => {
    it("returns every allocation consuming the application", async () => {
      await seedAllAllocations();

      const FOUND =
        await newTransactionAllocationRepository().findAllByApplicationId(
          EntityId.create(APPLICATION_ID),
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(TRANSACTION_ALLOCATION))).toBe(
        true,
      );
      expect(FOUND.some((ROW) => ROW.equals(SECOND_ALLOCATION))).toBe(true);
    });

    it("returns an empty array when no allocations exist", async () => {
      expect(
        await newTransactionAllocationRepository().findAllByApplicationId(
          EntityId.create(APPLICATION_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByApplicationIds", () => {
    it("returns every allocation of the provided applications", async () => {
      await seedAllAllocations();

      const FOUND =
        await newTransactionAllocationRepository().findAllByApplicationIds([
          EntityId.create(APPLICATION_ID),
          EntityId.create(OTHER_APPLICATION_ID),
        ]);

      expect(FOUND).toHaveLength(3);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newTransactionAllocationRepository().findAllByApplicationIds([]),
      ).toEqual([]);
    });
  });

  describe("findAllByWithdrawalId", () => {
    it("returns every allocation funding the withdrawal", async () => {
      await seedAllAllocations();

      const FOUND =
        await newTransactionAllocationRepository().findAllByWithdrawalId(
          EntityId.create(WITHDRAWAL_ID),
        );

      expect(FOUND).toHaveLength(1);
      expect(FOUND.some((ROW) => ROW.equals(TRANSACTION_ALLOCATION))).toBe(
        true,
      );
    });

    it("returns the allocations of the provided withdrawals", async () => {
      await seedAllAllocations();

      const FOUND =
        await newTransactionAllocationRepository().findAllByWithdrawIds([
          EntityId.create(WITHDRAWAL_ID),
          EntityId.create(OTHER_WITHDRAWAL_ID),
        ]);

      expect(FOUND).toHaveLength(3);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newTransactionAllocationRepository().findAllByWithdrawIds([]),
      ).toEqual([]);
    });
  });

  describe("sumQuotasConsumedByApplicationId", () => {
    it("totals the quotas consumed from the application", async () => {
      await seedAllAllocations();

      const TOTAL =
        await newTransactionAllocationRepository().sumQuotasConsumedByApplicationId(
          EntityId.create(APPLICATION_ID),
        );

      expect(TOTAL?.value.toString()).toBe(
        CONSUMED_QUOTAS_SUM.value.toString(),
      );
    });

    it("returns null when the application has no allocations", async () => {
      await seedAllAllocations();

      const TOTAL =
        await newTransactionAllocationRepository().sumQuotasConsumedByApplicationId(
          EntityId.create(OTHER_APPLICATION_ID),
        );

      expect(TOTAL?.value.toString()).toBe(
        OTHER_TRANSACTION_ALLOCATION.quotasConsumed.value.toString(),
      );
    });
  });

  describe("save", () => {
    it("persists a new allocation", async () => {
      await seedAllocations();

      const SAVED =
        await newTransactionAllocationRepository().save(FRESH_ALLOCATION);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.quotasConsumed.value.toString()).toBe(
        FRESH_ALLOCATION.quotasConsumed.value.toString(),
      );
      expect(
        (
          await newTransactionAllocationRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing allocation", async () => {
      await seedAllocations();

      await newTransactionAllocationRepository().save(
        UPDATED_TRANSACTION_ALLOCATION,
      );

      const FOUND = await newTransactionAllocationRepository().findById(
        EntityId.create(TRANSACTION_ALLOCATION_ID),
      );

      expect(FOUND?.quotasConsumed.value.toString()).toBe(
        UPDATED_TRANSACTION_ALLOCATION.quotasConsumed.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_TRANSACTION_ALLOCATION)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted allocation", async () => {
      await seedAllocations();

      await newTransactionAllocationRepository().delete(
        EntityId.create(TRANSACTION_ALLOCATION_ID),
      );

      expect(
        await newTransactionAllocationRepository().findById(
          EntityId.create(TRANSACTION_ALLOCATION_ID),
        ),
      ).toBeNull();
    });
  });
});
