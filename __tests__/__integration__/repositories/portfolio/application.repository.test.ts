import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  APPLICATION_SUM_AMOUNT,
  APPLICATION_SUM_QUOTAS,
  EXTERNAL_APPLICATION,
  FRESH_APPLICATION,
  JANUARY_WINDOW,
  newApplicationRepository,
  OTHER_APPLICATION,
  OTHER_POSITION_ID,
  seedAllApplications,
  seedApplications,
  UPDATED_APPLICATION,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  APPLICATION,
  APPLICATION_ID,
} from "@/__tests__/__seeds__/_application.seed";
import { POSITION_ID } from "@/__tests__/__seeds__/_position.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("ApplicationRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted application", async () => {
      await seedApplications();

      const FOUND = await newApplicationRepository().findById(APPLICATION_ID);

      expect(FOUND?.equals(APPLICATION)).toBe(true);
    });

    it("returns null when the application does not exist", async () => {
      expect(
        await newApplicationRepository().findById(APPLICATION_ID),
      ).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns the whole application series of the position", async () => {
      await seedAllApplications();

      const FOUND =
        await newApplicationRepository().findAllByPositionId(POSITION_ID);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(APPLICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_APPLICATION))).toBe(true);
    });

    it("returns an empty array when no applications exist", async () => {
      expect(
        await newApplicationRepository().findAllByPositionId(POSITION_ID),
      ).toEqual([]);
    });
  });

  describe("findAllByPositionIdInPeriod", () => {
    it("returns only the applications within the period, inclusive", async () => {
      await seedAllApplications();

      const FOUND =
        await newApplicationRepository().findAllByPositionIdInPeriod(
          POSITION_ID,
          JANUARY_WINDOW.start,
          JANUARY_WINDOW.end,
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(APPLICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_APPLICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_APPLICATION))).toBe(false);
    });
  });

  describe("findAllByPositionIdsInPeriod", () => {
    it("returns the applications of the positions within the period", async () => {
      await seedAllApplications();

      const FOUND =
        await newApplicationRepository().findAllByPositionIdsInPeriod(
          [POSITION_ID, OTHER_POSITION_ID],
          JANUARY_WINDOW.start,
          JANUARY_WINDOW.end,
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(APPLICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_APPLICATION))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newApplicationRepository().findAllByPositionIdsInPeriod(
          [],
          JANUARY_WINDOW.start,
          JANUARY_WINDOW.end,
        ),
      ).toEqual([]);
    });
  });

  describe("sumByPositionIdInPeriod", () => {
    it("totals the amounts and quotas of the period", async () => {
      await seedAllApplications();

      const TOTALS = await newApplicationRepository().sumByPositionIdInPeriod(
        POSITION_ID,
        JANUARY_WINDOW.start,
        JANUARY_WINDOW.end,
      );

      expect(TOTALS.amount?.value.toString()).toBe(
        APPLICATION_SUM_AMOUNT.value.toString(),
      );
      expect(TOTALS.quotas?.value.toString()).toBe(
        APPLICATION_SUM_QUOTAS.value.toString(),
      );
    });

    it("returns null totals when the position has no applications in the period", async () => {
      await seedAllApplications();

      const TOTALS = await newApplicationRepository().sumByPositionIdInPeriod(
        POSITION_ID,
        new Date("2026-12-01T00:00:00.000Z"),
        new Date("2026-12-31T00:00:00.000Z"),
      );

      expect(TOTALS.amount).toBeNull();
      expect(TOTALS.quotas).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new application", async () => {
      await seedApplications();

      const SAVED = await newApplicationRepository().save(FRESH_APPLICATION);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.amount.value.toString()).toBe(
        FRESH_APPLICATION.amount.value.toString(),
      );
      expect(
        (await newApplicationRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing application", async () => {
      await seedApplications();

      await newApplicationRepository().save(UPDATED_APPLICATION);

      const FOUND = await newApplicationRepository().findById(APPLICATION_ID);

      expect(FOUND?.amount.value.toString()).toBe(
        UPDATED_APPLICATION.amount.value.toString(),
      );
      expect(FOUND?.reversedAt?.getTime()).toBe(
        UPDATED_APPLICATION.reversedAt?.getTime(),
      );
      expect(FOUND?.equals(UPDATED_APPLICATION)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted application", async () => {
      await seedApplications();

      await newApplicationRepository().delete(APPLICATION_ID);

      expect(
        await newApplicationRepository().findById(APPLICATION_ID),
      ).toBeNull();
    });
  });
});
