import { describe, expect, it } from "vitest";

import { EntityId } from "@/business/value-objects/entity-id.vo";

const VALID_UUID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
const SAME_UUID_LOWERCASE = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
const SAME_UUID_UPPERCASE = "BA57AD33-3D94-4A4A-9A6F-B3F916F7B4A2";
const DIFFERENT_UUID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

describe("EntityId", () => {
  describe("create", () => {
    it("creates an entity id from a valid UUID", () => {
      const RESULT = EntityId.create(VALID_UUID);

      expect(RESULT).toBe(VALID_UUID);
    });

    it("normalizes the UUID to lowercase", () => {
      const RESULT = EntityId.create(SAME_UUID_UPPERCASE);

      expect(RESULT).toBe(SAME_UUID_LOWERCASE);
    });

    it("trims whitespace from the value", () => {
      const RESULT = EntityId.create(`  ${VALID_UUID}  `);

      expect(RESULT).toBe(VALID_UUID);
    });

    it("throws when the value is undefined", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => EntityId.create(undefined)).toThrow(
        "`EntityId` must be defined.",
      );
    });

    it("throws when the value is null", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => EntityId.create(null)).toThrow(
        "`EntityId` must be defined.",
      );
    });

    it("throws when the value is blank", () => {
      expect(() => EntityId.create("   ")).toThrow(
        "`EntityId` must not be blank.",
      );
    });

    it("throws when the value is not a valid UUID", () => {
      expect(() => EntityId.create("not-a-uuid")).toThrow(
        "`EntityId` must be a valid UUID.",
      );
    });

    it("throws when the value is a UUID without hyphens", () => {
      expect(() => EntityId.create("ba57ad333d944a4a9a6fb3f916f7b4a2")).toThrow(
        "`EntityId` must be a valid UUID.",
      );
    });

    it("throws when the value has invalid hex characters", () => {
      expect(() =>
        EntityId.create("zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"),
      ).toThrow("`EntityId` must be a valid UUID.");
    });
  });

  describe("equals", () => {
    it("returns true for identical UUIDs", () => {
      const A = EntityId.create(VALID_UUID);
      const B = EntityId.create(VALID_UUID);

      expect(EntityId.equals(A, B)).toBe(true);
    });

    it("returns true regardless of original casing", () => {
      const A = EntityId.create(SAME_UUID_LOWERCASE);
      const B = EntityId.create(SAME_UUID_UPPERCASE);

      expect(EntityId.equals(A, B)).toBe(true);
    });

    it("returns false for different UUIDs", () => {
      const A = EntityId.create(VALID_UUID);
      const B = EntityId.create(DIFFERENT_UUID);

      expect(EntityId.equals(A, B)).toBe(false);
    });
  });
});
