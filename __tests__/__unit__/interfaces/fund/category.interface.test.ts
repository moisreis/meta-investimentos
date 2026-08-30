import { beforeEach, describe, expect, it } from "vitest";

import {
  CATEGORY,
  CATEGORY_ID,
  createInMemoryCategoryRepository,
} from "@/__tests__/__helpers__/interfaces/_category.test.helper";

import { Category } from "@/business/entities/fund/category.entity";
import type { ICategory } from "@/business/interfaces/fund/category.interface";

describe("ICategory", () => {
  let REPOSITORY: ICategory;

  beforeEach(() => {
    REPOSITORY = createInMemoryCategoryRepository();
  });

  describe("findById", () => {
    it("returns the persisted category", async () => {
      await REPOSITORY.save(CATEGORY);

      const FOUND = await REPOSITORY.findById(CATEGORY_ID);

      expect(FOUND?.equals(CATEGORY)).toBe(true);
    });

    it("returns null when the category does not exist", async () => {
      expect(await REPOSITORY.findById(CATEGORY_ID)).toBeNull();
    });
  });

  describe("findByName", () => {
    it("returns the persisted category matching the name", async () => {
      await REPOSITORY.save(CATEGORY);

      const FOUND = await REPOSITORY.findByName("Ações");

      expect(FOUND?.equals(CATEGORY)).toBe(true);
    });

    it("returns null when the category does not exist", async () => {
      expect(await REPOSITORY.findByName("Ações")).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new category", async () => {
      await REPOSITORY.save(CATEGORY);

      const FOUND = await REPOSITORY.findById(CATEGORY_ID);

      expect(FOUND?.equals(CATEGORY)).toBe(true);
    });

    it("updates an existing category", async () => {
      await REPOSITORY.save(CATEGORY);

      const UPDATED_CATEGORY = Category.create(
        { name: "Ações Brasileiras" },
        CATEGORY_ID,
      );

      await REPOSITORY.save(UPDATED_CATEGORY);

      const FOUND = await REPOSITORY.findById(CATEGORY_ID);

      expect(FOUND?.name).toBe("Ações Brasileiras");
    });
  });

  describe("delete", () => {
    it("removes the persisted category", async () => {
      await REPOSITORY.save(CATEGORY);

      await REPOSITORY.delete(CATEGORY_ID);

      expect(await REPOSITORY.findById(CATEGORY_ID)).toBeNull();
    });
  });
});
