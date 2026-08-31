import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  EXTERNAL_WITHDRAWAL,
  FRESH_WITHDRAWAL,
  JANUARY_WINDOW,
  newWithdrawalRepository,
  OTHER_POSITION_ID,
  seedAllWithdrawals,
  seedWithdrawals,
  UPDATED_WITHDRAWAL,
  WITHDRAWAL_SUM_AMOUNT,
  WITHDRAWAL_SUM_QUOTAS,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import { POSITION_ID } from "@/__tests__/__seeds__/_position.seed";
import {
  WITHDRAWAL,
  WITHDRAWAL_ID,
} from "@/__tests__/__seeds__/_withdrawal.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("WithdrawalRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted withdrawal", async () => {
      await seedWithdrawals();

      const FOUND = await newWithdrawalRepository().findById(WITHDRAWAL_ID);

      expect(FOUND?.equals(WITHDRAWAL)).toBe(true);
    });

    it("returns null when the withdrawal does not exist", async () => {
      expect(
        await newWithdrawalRepository().findById(WITHDRAWAL_ID),
      ).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns the whole withdrawal series of the position", async () => {
      await seedAllWithdrawals();

      const FOUND =
        await newWithdrawalRepository().findAllByPositionId(POSITION_ID);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(WITHDRAWAL))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_WITHDRAWAL))).toBe(true);
    });

    it("returns an empty array when no withdrawals exist", async () => {
      expect(
        await newWithdrawalRepository().findAllByPositionId(POSITION_ID),
      ).toEqual([]);
    });
  });

  describe("findAllByPositionIdInPeriod", () => {
    it("returns only the withdrawals within the period, inclusive", async () => {
      await seedAllWithdrawals();

      const FOUND = await newWithdrawalRepository().findAllByPositionIdInPeriod(
        POSITION_ID,
        JANUARY_WINDOW.start,
        JANUARY_WINDOW.end,
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(WITHDRAWAL))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_WITHDRAWAL))).toBe(true);
    });
  });

  describe("findAllByPositionIdsInPeriod", () => {
    it("returns the withdrawals of the positions within the period", async () => {
      await seedAllWithdrawals();

      const FOUND =
        await newWithdrawalRepository().findAllByPositionIdsInPeriod(
          [POSITION_ID, OTHER_POSITION_ID],
          JANUARY_WINDOW.start,
          JANUARY_WINDOW.end,
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(WITHDRAWAL))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_WITHDRAWAL))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newWithdrawalRepository().findAllByPositionIdsInPeriod(
          [],
          JANUARY_WINDOW.start,
          JANUARY_WINDOW.end,
        ),
      ).toEqual([]);
    });
  });

  describe("sumByPositionIdInPeriod", () => {
    it("totals the amounts and quotas of the period", async () => {
      await seedAllWithdrawals();

      const TOTALS = await newWithdrawalRepository().sumByPositionIdInPeriod(
        POSITION_ID,
        JANUARY_WINDOW.start,
        JANUARY_WINDOW.end,
      );

      expect(TOTALS.amount?.value.toString()).toBe(
        WITHDRAWAL_SUM_AMOUNT.value.toString(),
      );
      expect(TOTALS.quotas?.value.toString()).toBe(
        WITHDRAWAL_SUM_QUOTAS.value.toString(),
      );
    });

    it("returns null totals when the position has no withdrawals in the period", async () => {
      await seedAllWithdrawals();

      const TOTALS = await newWithdrawalRepository().sumByPositionIdInPeriod(
        POSITION_ID,
        new Date("2026-12-01T00:00:00.000Z"),
        new Date("2026-12-31T00:00:00.000Z"),
      );

      expect(TOTALS.amount).toBeNull();
      expect(TOTALS.quotas).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new withdrawal", async () => {
      await seedWithdrawals();

      const SAVED = await newWithdrawalRepository().save(FRESH_WITHDRAWAL);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.amount.value.toString()).toBe(
        FRESH_WITHDRAWAL.amount.value.toString(),
      );
      expect(
        (await newWithdrawalRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing withdrawal", async () => {
      await seedWithdrawals();

      await newWithdrawalRepository().save(UPDATED_WITHDRAWAL);

      const FOUND = await newWithdrawalRepository().findById(WITHDRAWAL_ID);

      expect(FOUND?.amount.value.toString()).toBe(
        UPDATED_WITHDRAWAL.amount.value.toString(),
      );
      expect(FOUND?.reversedAt?.getTime()).toBe(
        UPDATED_WITHDRAWAL.reversedAt?.getTime(),
      );
      expect(FOUND?.equals(UPDATED_WITHDRAWAL)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted withdrawal", async () => {
      await seedWithdrawals();

      await newWithdrawalRepository().delete(WITHDRAWAL_ID);

      expect(
        await newWithdrawalRepository().findById(WITHDRAWAL_ID),
      ).toBeNull();
    });
  });
});
