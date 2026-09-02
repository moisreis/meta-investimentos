import { beforeEach, describe, expect, it } from "vitest";

import {
  APPLICATION,
  APPLICATION_DATE,
  APPLICATION_ID,
  createInMemoryApplicationRepository,
  OTHER_POSITION_ID,
  POSITION_ID,
} from "@/__tests__/__helpers__/interfaces/_application.test.helper";

import { Application } from "@/business/entities/portfolio/application.entity";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

describe("IApplication", () => {
  let REPOSITORY: IApplication;

  beforeEach(() => {
    REPOSITORY = createInMemoryApplicationRepository();
  });

  describe("findById", () => {
    it("returns the persisted application", async () => {
      await REPOSITORY.save(APPLICATION);

      const FOUND = await REPOSITORY.findById(EntityId.create(APPLICATION_ID));

      expect(FOUND?.equals(APPLICATION)).toBe(true);
    });

    it("returns null when the application does not exist", async () => {
      expect(
        await REPOSITORY.findById(EntityId.create(APPLICATION_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns all persisted applications for the position", async () => {
      const SECOND_APPLICATION = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: PositiveMoney.create("2000.00"),
          quotas: QuotaQuantity.create("24.5"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_APPLICATION = Application.create(
        {
          positionId: EntityId.create(OTHER_POSITION_ID),
          date: new Date("2026-01-25T00:00:00.000Z"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("6.123"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(APPLICATION);
      await REPOSITORY.save(SECOND_APPLICATION);
      await REPOSITORY.save(OTHER_APPLICATION);

      const FOUND = await REPOSITORY.findAllByPositionId(
        EntityId.create(POSITION_ID),
      );

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(APPLICATION)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_APPLICATION)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByPositionId(EntityId.create(POSITION_ID)),
      ).toEqual([]);
    });
  });

  describe("findAllByPositionIdInPeriod", () => {
    it("returns only the applications within the period", async () => {
      const BEFORE = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-05T00:00:00.000Z"),
          amount: PositiveMoney.create("100.00"),
          quotas: QuotaQuantity.create("1.2"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const INSIDE = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          amount: PositiveMoney.create("300.00"),
          quotas: QuotaQuantity.create("3.5"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );
      const AFTER = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-02-25T00:00:00.000Z"),
          amount: PositiveMoney.create("200.00"),
          quotas: QuotaQuantity.create("2.4"),
        },
        "e6b4f8a2-7c01-4d23-9e58-3f9a1b2c4d75",
      );

      await REPOSITORY.save(BEFORE);
      await REPOSITORY.save(INSIDE);
      await REPOSITORY.save(AFTER);

      const START_DATE = new Date("2026-01-10T00:00:00.000Z");
      const END_DATE = new Date("2026-01-20T00:00:00.000Z");

      const FOUND = await REPOSITORY.findAllByPositionIdInPeriod(
        EntityId.create(POSITION_ID),
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
          EntityId.create(POSITION_ID),
          START_DATE,
          END_DATE,
        ),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new application", async () => {
      await REPOSITORY.save(APPLICATION);

      const FOUND = await REPOSITORY.findById(EntityId.create(APPLICATION_ID));

      expect(FOUND?.equals(APPLICATION)).toBe(true);
    });

    it("updates an existing application", async () => {
      await REPOSITORY.save(APPLICATION);

      const UPDATED = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: APPLICATION_DATE,
          amount: PositiveMoney.create("1500.00"),
          quotas: QuotaQuantity.create("18.75"),
        },
        APPLICATION_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(APPLICATION_ID));

      expect(FOUND?.quotas.value.toString()).toBe("18.75");
    });
  });

  describe("delete", () => {
    it("removes the persisted application", async () => {
      await REPOSITORY.save(APPLICATION);

      await REPOSITORY.delete(EntityId.create(APPLICATION_ID));

      expect(
        await REPOSITORY.findById(EntityId.create(APPLICATION_ID)),
      ).toBeNull();
    });
  });
});
