import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryWithdrawalRepository,
  OTHER_POSITION_ID,
  POSITION_ID,
  WITHDRAWAL,
  WITHDRAWAL_DATE,
  WITHDRAWAL_ID,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";

import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import type { IWithdrawal } from "@/business/interfaces/portfolio/withdrawal.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("IWithdrawal", () => {
  let REPOSITORY: IWithdrawal;

  beforeEach(() => {
    REPOSITORY = createInMemoryWithdrawalRepository();
  });

  describe("findById", () => {
    it("returns the persisted withdrawal", async () => {
      await REPOSITORY.save(WITHDRAWAL);

      const FOUND = await REPOSITORY.findById(WITHDRAWAL_ID);

      expect(FOUND?.equals(WITHDRAWAL)).toBe(true);
    });

    it("returns null when the withdrawal does not exist", async () => {
      expect(await REPOSITORY.findById(WITHDRAWAL_ID)).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns all persisted withdrawals for the position", async () => {
      const SECOND_WITHDRAWAL = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: PositiveMoney.create("200.00"),
          quotas: QuotaQuantity.create("2.4"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_WITHDRAWAL = Withdrawal.create(
        {
          positionId: EntityId.create(OTHER_POSITION_ID),
          date: new Date("2026-01-25T00:00:00.000Z"),
          amount: PositiveMoney.create("300.00"),
          quotas: QuotaQuantity.create("3.6"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(WITHDRAWAL);
      await REPOSITORY.save(SECOND_WITHDRAWAL);
      await REPOSITORY.save(OTHER_WITHDRAWAL);

      const FOUND = await REPOSITORY.findAllByPositionId(POSITION_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(WITHDRAWAL)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_WITHDRAWAL)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByPositionId(POSITION_ID)).toEqual([]);
    });
  });

  describe("findAllByPositionIdInPeriod", () => {
    it("returns only the withdrawals within the period", async () => {
      const BEFORE = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-05T00:00:00.000Z"),
          amount: PositiveMoney.create("50.00"),
          quotas: QuotaQuantity.create("0.6"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const INSIDE = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          amount: PositiveMoney.create("150.00"),
          quotas: QuotaQuantity.create("1.8"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );
      const AFTER = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-02-25T00:00:00.000Z"),
          amount: PositiveMoney.create("100.00"),
          quotas: QuotaQuantity.create("1.2"),
        },
        "e6b4f8a2-7c01-4d23-9e58-3f9a1b2c4d75",
      );

      await REPOSITORY.save(BEFORE);
      await REPOSITORY.save(INSIDE);
      await REPOSITORY.save(AFTER);

      const START_DATE = new Date("2026-01-10T00:00:00.000Z");
      const END_DATE = new Date("2026-01-20T00:00:00.000Z");

      const FOUND = await REPOSITORY.findAllByPositionIdInPeriod(
        POSITION_ID,
        START_DATE,
        END_DATE,
      );

      expect(FOUND.length).toBe(1);
      expect(FOUND[0]?.equals(INSIDE)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      const START_DATE = new Date("2026-01-10T00:00:00.000Z");
      const END_DATE = new Date("2026-01-20T00:00:00.000Z");

      expect(
        await REPOSITORY.findAllByPositionIdInPeriod(
          POSITION_ID,
          START_DATE,
          END_DATE,
        ),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new withdrawal", async () => {
      await REPOSITORY.save(WITHDRAWAL);

      const FOUND = await REPOSITORY.findById(WITHDRAWAL_ID);

      expect(FOUND?.equals(WITHDRAWAL)).toBe(true);
    });

    it("updates an existing withdrawal", async () => {
      await REPOSITORY.save(WITHDRAWAL);

      const UPDATED = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: WITHDRAWAL_DATE,
          amount: PositiveMoney.create("750.00"),
          quotas: QuotaQuantity.create("9.25"),
        },
        WITHDRAWAL_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(WITHDRAWAL_ID);

      expect(FOUND?.quotas.value.toString()).toBe("9.25");
    });
  });

  describe("delete", () => {
    it("removes the persisted withdrawal", async () => {
      await REPOSITORY.save(WITHDRAWAL);

      await REPOSITORY.delete(WITHDRAWAL_ID);

      expect(await REPOSITORY.findById(WITHDRAWAL_ID)).toBeNull();
    });
  });
});
