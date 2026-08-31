import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  FRESH_VERIFICATION,
  newVerificationRepository,
  OTHER_VERIFICATION,
  SECOND_VERIFICATION,
  seedSecondVerification,
  seedVerifications,
  UPDATED_VERIFICATION,
  VERIFICATION,
  VERIFICATION_ID,
} from "@/__tests__/__helpers__/repositories/_user.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("VerificationRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted verification", async () => {
      await seedVerifications();

      const FOUND = await newVerificationRepository().findById(VERIFICATION_ID);

      expect(FOUND?.equals(VERIFICATION)).toBe(true);
    });

    it("returns null when the verification does not exist", async () => {
      expect(
        await newVerificationRepository().findById(VERIFICATION_ID),
      ).toBeNull();
    });
  });

  describe("findAllByIdentifier", () => {
    it("returns all verifications of the identifier", async () => {
      await seedVerifications();
      await seedSecondVerification();

      const FOUND = await newVerificationRepository().findAllByIdentifier(
        VERIFICATION.identifier,
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(VERIFICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(SECOND_VERIFICATION))).toBe(true);
    });

    it("does not include verifications of other identifiers", async () => {
      await seedVerifications();
      await seedSecondVerification();

      const FOUND = await newVerificationRepository().findAllByIdentifier(
        OTHER_VERIFICATION.identifier,
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(OTHER_VERIFICATION)).toBe(true);
    });
  });

  describe("findAllByIdentifiers", () => {
    it("returns the verifications of all the provided identifiers", async () => {
      await seedVerifications();

      const FOUND = await newVerificationRepository().findAllByIdentifiers([
        VERIFICATION.identifier,
        OTHER_VERIFICATION.identifier,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(VERIFICATION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_VERIFICATION))).toBe(true);
    });

    it("returns an empty array when no identifiers are provided", async () => {
      expect(
        await newVerificationRepository().findAllByIdentifiers([]),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new verification", async () => {
      await seedVerifications();

      const SAVED = await newVerificationRepository().save(FRESH_VERIFICATION);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.value).toBe(FRESH_VERIFICATION.value);
      expect(
        (
          await newVerificationRepository().findById(SAVED.id as string)
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing verification", async () => {
      await seedVerifications();

      await newVerificationRepository().save(UPDATED_VERIFICATION);

      const FOUND = await newVerificationRepository().findById(VERIFICATION_ID);

      expect(FOUND?.value).toBe(UPDATED_VERIFICATION.value);
      expect(FOUND?.equals(UPDATED_VERIFICATION)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted verification", async () => {
      await seedVerifications();

      await newVerificationRepository().delete(VERIFICATION_ID);

      expect(
        await newVerificationRepository().findById(VERIFICATION_ID),
      ).toBeNull();
    });
  });
});
