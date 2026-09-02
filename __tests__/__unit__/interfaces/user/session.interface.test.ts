import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemorySessionRepository,
  EXPIRES_AT,
  OTHER_SESSION,
  OTHER_USER_ID,
  SESSION,
  SESSION_ID,
  USER_ID,
} from "@/__tests__/__helpers__/interfaces/_session.test.helper";

import { Session } from "@/business/entities/user/session.entity";
import type { ISession } from "@/business/interfaces/user/session.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("ISession", () => {
  let REPOSITORY: ISession;

  beforeEach(() => {
    REPOSITORY = createInMemorySessionRepository();
  });

  describe("findById", () => {
    it("returns the persisted session", async () => {
      await REPOSITORY.save(SESSION);

      const FOUND = await REPOSITORY.findById(EntityId.create(SESSION_ID));

      expect(FOUND?.equals(SESSION)).toBe(true);
    });

    it("returns null when the session does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(SESSION_ID))).toBeNull();
    });
  });

  describe("findByToken", () => {
    it("returns the persisted session", async () => {
      await REPOSITORY.save(SESSION);

      const FOUND = await REPOSITORY.findByToken(SESSION.token);

      expect(FOUND?.equals(SESSION)).toBe(true);
    });

    it("returns null when no session has the token", async () => {
      expect(await REPOSITORY.findByToken(SESSION.token)).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns all sessions of the persisted user", async () => {
      await REPOSITORY.save(SESSION);
      await REPOSITORY.save(OTHER_SESSION);

      const FIRST = Session.create(
        {
          userId: EntityId.create(OTHER_USER_ID),
          token: "first-session-token",
          expiresAt: EXPIRES_AT,
        },
        "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
      );

      await REPOSITORY.save(FIRST);

      const FOUND = await REPOSITORY.findAllByUserId(
        EntityId.create(OTHER_USER_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_SESSION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(FIRST))).toBe(true);
    });

    it("returns an empty array when the user has no sessions", async () => {
      expect(
        await REPOSITORY.findAllByUserId(EntityId.create(USER_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new session", async () => {
      const SAVED = await REPOSITORY.save(SESSION);

      expect(SAVED.equals(SESSION)).toBe(true);
      expect(
        (await REPOSITORY.findById(EntityId.create(SESSION_ID)))?.equals(
          SESSION,
        ),
      ).toBe(true);
    });

    it("updates an existing session", async () => {
      await REPOSITORY.save(SESSION);

      const UPDATED = Session.create(
        {
          userId: SESSION.userId,
          token: "updated-session-token",
          expiresAt: SESSION.expiresAt,
        },
        SESSION_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(SESSION_ID));

      expect(FOUND?.token).toBe("updated-session-token");
      expect(FOUND?.equals(UPDATED)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted session", async () => {
      await REPOSITORY.save(SESSION);

      await REPOSITORY.delete(EntityId.create(SESSION_ID));

      expect(await REPOSITORY.findById(EntityId.create(SESSION_ID))).toBeNull();
    });
  });
});
