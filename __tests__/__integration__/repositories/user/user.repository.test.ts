import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  FRESH_USER,
  newUserRepository,
  OTHER_USER,
  OTHER_USER_ID,
  seedUsers,
  UPDATED_USER,
  USER,
  USER_ID,
} from "@/__tests__/__helpers__/repositories/_user.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("UserRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted user", async () => {
      await seedUsers();

      const FOUND = await newUserRepository().findById(USER_ID);

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when the user does not exist", async () => {
      expect(await newUserRepository().findById(USER_ID)).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("returns the persisted user", async () => {
      await seedUsers();

      const FOUND = await newUserRepository().findByEmail(USER.email);

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when no user has the email", async () => {
      expect(await newUserRepository().findByEmail(USER.email)).toBeNull();
    });
  });

  describe("findByCpf", () => {
    it("returns the persisted user", async () => {
      await seedUsers();

      const FOUND = await newUserRepository().findByCpf(USER.cpf);

      expect(FOUND?.equals(USER)).toBe(true);
    });

    it("returns null when no user has the cpf", async () => {
      expect(await newUserRepository().findByCpf(USER.cpf)).toBeNull();
    });
  });

  describe("findAllByIds", () => {
    it("returns all users with the provided ids", async () => {
      await seedUsers();

      const FOUND = await newUserRepository().findAllByIds([
        USER_ID,
        OTHER_USER_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(USER))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_USER))).toBe(true);
    });

    it("filters out ids that do not exist", async () => {
      await seedUsers();

      const FOUND = await newUserRepository().findAllByIds([USER_ID]);

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(USER)).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newUserRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new user", async () => {
      const SAVED = await newUserRepository().save(FRESH_USER);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.email).toBe(FRESH_USER.email);
      expect(
        (await newUserRepository().findById(SAVED.id as string))?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing user", async () => {
      await seedUsers();

      await newUserRepository().save(UPDATED_USER);

      const FOUND = await newUserRepository().findById(USER_ID);

      expect(FOUND?.name).toBe(UPDATED_USER.name);
      expect(FOUND?.equals(UPDATED_USER)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted user", async () => {
      await seedUsers();

      await newUserRepository().delete(USER_ID);

      expect(await newUserRepository().findById(USER_ID)).toBeNull();
    });
  });
});
