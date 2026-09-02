import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  newPositionRepository,
  POSITION_ID,
  seedPositionById,
  seedPositionFixtureParents,
  UPDATED_POSITION,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ConcurrencyError, NotFoundError } from "@/shared/errors";

describe("OptimisticLocking", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("save", () => {
    it("bumps the version of the persisted row on update", async () => {
      await seedPositionById(POSITION_ID);

      const SAVED = await newPositionRepository().save(UPDATED_POSITION);

      expect(SAVED.version).toBe(1);

      const FOUND = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(FOUND?.version).toBe(1);
    });

    it("throws a ConcurrencyError when the persisted version is stale", async () => {
      await seedPositionById(POSITION_ID);
      await newPositionRepository().save(UPDATED_POSITION);

      await expect(
        newPositionRepository().save(UPDATED_POSITION),
      ).rejects.toBeInstanceOf(ConcurrencyError);

      const FOUND = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(FOUND?.version).toBe(1);
      expect(FOUND?.initialBalance?.value.toString()).toBe(
        UPDATED_POSITION.initialBalance?.value.toString(),
      );
    });

    it("throws a NotFoundError when the row does not exist", async () => {
      await seedPositionFixtureParents();

      await expect(
        newPositionRepository().save(UPDATED_POSITION),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
