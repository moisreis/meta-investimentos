import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  FRESH_NORM,
  NORM,
  NORM_ID,
  newNormRepository,
  OTHER_NORM,
  seedNormFixtureParents,
  seedNorms,
  UPDATED_NORM,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  CATEGORY_ID,
  OTHER_CATEGORY_ID,
} from "@/__tests__/__seeds__/_category.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("NormRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted norm", async () => {
      await seedNorms();

      const FOUND = await newNormRepository().findById(
        EntityId.create(NORM_ID),
      );

      expect(FOUND?.equals(NORM)).toBe(true);
    });

    it("returns null when the norm does not exist", async () => {
      expect(
        await newNormRepository().findById(EntityId.create(NORM_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByCategoryId", () => {
    it("returns every norm of the category", async () => {
      await seedNorms();

      const FOUND = await newNormRepository().findAllByCategoryId(
        EntityId.create(CATEGORY_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND.some((ROW) => ROW.equals(NORM))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_NORM))).toBe(false);
    });

    it("returns an empty array when the category has no norms", async () => {
      expect(
        await newNormRepository().findAllByCategoryId(
          EntityId.create(CATEGORY_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByCategoryIds", () => {
    it("returns every norm of the provided categories", async () => {
      await seedNorms();

      const FOUND = await newNormRepository().findAllByCategoryIds([
        EntityId.create(CATEGORY_ID),
        EntityId.create(OTHER_CATEGORY_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(NORM))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_NORM))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newNormRepository().findAllByCategoryIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new norm", async () => {
      await seedNormFixtureParents();

      const SAVED = await newNormRepository().save(FRESH_NORM);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.articleNumber).toBe(FRESH_NORM.articleNumber);
      expect(
        (
          await newNormRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing norm", async () => {
      await seedNorms();

      await newNormRepository().save(UPDATED_NORM);

      const FOUND = await newNormRepository().findById(
        EntityId.create(NORM_ID),
      );

      expect(FOUND?.targetAllocation.value.toString()).toBe(
        UPDATED_NORM.targetAllocation.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_NORM)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted norm", async () => {
      await seedNorms();

      await newNormRepository().delete(EntityId.create(NORM_ID));

      expect(
        await newNormRepository().findById(EntityId.create(NORM_ID)),
      ).toBeNull();
    });
  });
});
