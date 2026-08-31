import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  FRESH_SESSION,
  newSessionRepository,
  OTHER_SESSION,
  OTHER_USER_ID,
  SESSION,
  SESSION_ID,
  seedSessions,
  seedThirdSession,
  THIRD_SESSION,
  UPDATED_SESSION,
  USER_ID,
} from "@/__tests__/__helpers__/repositories/_user.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("SessionRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted session", async () => {
      await seedSessions();

      const FOUND = await newSessionRepository().findById(SESSION_ID);

      expect(FOUND?.equals(SESSION)).toBe(true);
    });

    it("returns null when the session does not exist", async () => {
      expect(await newSessionRepository().findById(SESSION_ID)).toBeNull();
    });
  });

  describe("findByToken", () => {
    it("returns the persisted session", async () => {
      await seedSessions();

      const FOUND = await newSessionRepository().findByToken(SESSION.token);

      expect(FOUND?.equals(SESSION)).toBe(true);
    });

    it("returns null when no session has the token", async () => {
      expect(
        await newSessionRepository().findByToken(SESSION.token),
      ).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns all sessions of the user", async () => {
      await seedSessions();
      await seedThirdSession();

      const FOUND = await newSessionRepository().findAllByUserId(USER_ID);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(SESSION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_SESSION))).toBe(true);
    });

    it("returns an empty array when no sessions exist", async () => {
      expect(await newSessionRepository().findAllByUserId(USER_ID)).toEqual([]);
    });
  });

  describe("findAllByUserIds", () => {
    it("returns the sessions of all the provided users", async () => {
      await seedSessions();

      const FOUND = await newSessionRepository().findAllByUserIds([
        USER_ID,
        OTHER_USER_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(SESSION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_SESSION))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newSessionRepository().findAllByUserIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new session", async () => {
      await seedSessions();

      const SAVED = await newSessionRepository().save(FRESH_SESSION);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.token).toBe(FRESH_SESSION.token);
      expect(
        (await newSessionRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing session", async () => {
      await seedSessions();

      await newSessionRepository().save(UPDATED_SESSION);

      const FOUND = await newSessionRepository().findById(SESSION_ID);

      expect(FOUND?.token).toBe(UPDATED_SESSION.token);
      expect(FOUND?.equals(UPDATED_SESSION)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted session", async () => {
      await seedSessions();

      await newSessionRepository().delete(SESSION_ID);

      expect(await newSessionRepository().findById(SESSION_ID)).toBeNull();
    });
  });
});
