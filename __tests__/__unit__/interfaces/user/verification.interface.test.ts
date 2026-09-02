import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryVerificationRepository,
  OTHER_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
} from "@/__tests__/__helpers__/interfaces/_verification.test.helper";

import { Verification } from "@/business/entities/user/verification.entity";
import type { IVerification } from "@/business/interfaces/user/verification.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IVerification", () => {
  let REPOSITORY: IVerification;

  beforeEach(() => {
    REPOSITORY = createInMemoryVerificationRepository();
  });

  describe("findById", () => {
    it("returns the persisted verification", async () => {
      await REPOSITORY.save(VERIFICATION);

      const FOUND = await REPOSITORY.findById(EntityId.create(VERIFICATION_ID));

      expect(FOUND?.equals(VERIFICATION)).toBe(true);
    });

    it("returns null when the verification does not exist", async () => {
      expect(
        await REPOSITORY.findById(EntityId.create(VERIFICATION_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByIdentifier", () => {
    it("returns all verifications for the persisted identifier", async () => {
      await REPOSITORY.save(VERIFICATION);

      const FIRST = Verification.create(
        {
          identifier: VERIFICATION.identifier,
          value: "another-token",
          expiresAt: new Date("2026-03-01T00:00:00.000Z"),
        },
        "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
      );

      await REPOSITORY.save(FIRST);
      await REPOSITORY.save(OTHER_VERIFICATION);

      const FOUND = await REPOSITORY.findAllByIdentifier(
        VERIFICATION.identifier,
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(VERIFICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(FIRST))).toBe(true);
    });

    it("returns an empty array when the identifier has no verifications", async () => {
      expect(
        await REPOSITORY.findAllByIdentifier(VERIFICATION.identifier),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new verification", async () => {
      const SAVED = await REPOSITORY.save(VERIFICATION);

      expect(SAVED.equals(VERIFICATION)).toBe(true);
      expect(
        (await REPOSITORY.findById(EntityId.create(VERIFICATION_ID)))?.equals(
          VERIFICATION,
        ),
      ).toBe(true);
    });

    it("updates an existing verification", async () => {
      await REPOSITORY.save(VERIFICATION);

      const UPDATED = Verification.create(
        {
          identifier: VERIFICATION.identifier,
          value: "updated-token",
          expiresAt: VERIFICATION.expiresAt,
        },
        VERIFICATION_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(VERIFICATION_ID));

      expect(FOUND?.value).toBe("updated-token");
      expect(FOUND?.equals(UPDATED)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted verification", async () => {
      await REPOSITORY.save(VERIFICATION);

      await REPOSITORY.delete(EntityId.create(VERIFICATION_ID));

      expect(
        await REPOSITORY.findById(EntityId.create(VERIFICATION_ID)),
      ).toBeNull();
    });
  });
});
