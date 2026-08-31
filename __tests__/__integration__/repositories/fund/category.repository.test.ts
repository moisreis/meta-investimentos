import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  CATEGORY,
  CATEGORY_ID,
  FRESH_CATEGORY,
  newCategoryRepository,
  OTHER_CATEGORY_ID,
  seedCategories,
  UPDATED_CATEGORY,
} from "@/__tests__/__helpers__/repositories/_fund.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("CategoryRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted category", async () => {
      await seedCategories();

      const FOUND = await newCategoryRepository().findById(CATEGORY_ID);

      expect(FOUND?.equals(CATEGORY)).toBe(true);
    });

    it("returns null when the category does not exist", async () => {
      expect(await newCategoryRepository().findById(CATEGORY_ID)).toBeNull();
    });
  });

  describe("findByName", () => {
    it("returns the category with the name", async () => {
      await seedCategories();

      const FOUND = await newCategoryRepository().findByName(CATEGORY.name);

      expect(FOUND?.equals(CATEGORY)).toBe(true);
    });

    it("returns null when no category has the name", async () => {
      expect(
        await newCategoryRepository().findByName(CATEGORY.name),
      ).toBeNull();
    });
  });

  describe("findAllByIds", () => {
    it("returns all categories with the provided ids", async () => {
      await seedCategories();

      const FOUND = await newCategoryRepository().findAllByIds([
        CATEGORY_ID,
        OTHER_CATEGORY_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(CATEGORY))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newCategoryRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new category", async () => {
      const SAVED = await newCategoryRepository().save(FRESH_CATEGORY);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.name).toBe(FRESH_CATEGORY.name);
      expect(
        (await newCategoryRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing category", async () => {
      await seedCategories();

      await newCategoryRepository().save(UPDATED_CATEGORY);

      const FOUND = await newCategoryRepository().findById(CATEGORY_ID);

      expect(FOUND?.name).toBe(UPDATED_CATEGORY.name);
      expect(FOUND?.equals(UPDATED_CATEGORY)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted category", async () => {
      await seedCategories();

      await newCategoryRepository().delete(CATEGORY_ID);

      expect(await newCategoryRepository().findById(CATEGORY_ID)).toBeNull();
    });
  });
});
