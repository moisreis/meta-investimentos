import { beforeEach, describe, expect, it } from "vitest";

import {
  CATEGORY_ID,
  createInMemoryNormRepository,
  NORM,
  NORM_ID,
  OTHER_CATEGORY_ID,
} from "@/__tests__/__helpers__/interfaces/_norm.test.helper";

import { Norm } from "@/business/entities/portfolio/norm.entity";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("INorm", () => {
  let REPOSITORY: INorm;

  beforeEach(() => {
    REPOSITORY = createInMemoryNormRepository();
  });

  describe("findById", () => {
    it("returns the persisted norm", async () => {
      await REPOSITORY.save(NORM);

      const FOUND = await REPOSITORY.findById(NORM_ID);

      expect(FOUND?.equals(NORM)).toBe(true);
    });

    it("returns null when the norm does not exist", async () => {
      expect(await REPOSITORY.findById(NORM_ID)).toBeNull();
    });
  });

  describe("findAllByCategoryId", () => {
    it("returns all persisted norms for the category", async () => {
      const SECOND_NORM = Norm.create(
        {
          articleNumber: "Art. 15",
          name: "Limite de Exposição",
          categoryId: CATEGORY_ID,
          minAllocation: SignedPercentage.create("3"),
          maxAllocation: SignedPercentage.create("30"),
          targetAllocation: SignedPercentage.create("15"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_NORM = Norm.create(
        {
          articleNumber: "Art. 20",
          name: "Limite de Derivativos",
          categoryId: OTHER_CATEGORY_ID,
          minAllocation: SignedPercentage.create("0"),
          maxAllocation: SignedPercentage.create("15"),
          targetAllocation: SignedPercentage.create("8"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(NORM);
      await REPOSITORY.save(SECOND_NORM);
      await REPOSITORY.save(OTHER_NORM);

      const FOUND = await REPOSITORY.findAllByCategoryId(CATEGORY_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(NORM)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_NORM)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByCategoryId(CATEGORY_ID)).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new norm", async () => {
      await REPOSITORY.save(NORM);

      const FOUND = await REPOSITORY.findById(NORM_ID);

      expect(FOUND?.equals(NORM)).toBe(true);
    });

    it("updates an existing norm", async () => {
      await REPOSITORY.save(NORM);

      const UPDATED = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração Revisado",
          categoryId: CATEGORY_ID,
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("25"),
          targetAllocation: SignedPercentage.create("15"),
        },
        NORM_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(NORM_ID);

      expect(FOUND?.targetAllocation.value.toString()).toBe("15");
    });
  });

  describe("delete", () => {
    it("removes the persisted norm", async () => {
      await REPOSITORY.save(NORM);

      await REPOSITORY.delete(NORM_ID);

      expect(await REPOSITORY.findById(NORM_ID)).toBeNull();
    });
  });
});
