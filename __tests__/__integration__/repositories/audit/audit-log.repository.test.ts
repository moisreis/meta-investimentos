import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  AUDIT_LOG,
  newAuditLogRepository,
  OTHER_AUDIT_LOG,
  seedAuditLogs,
} from "@/__tests__/__helpers__/repositories/_audit.test.helper";
import { OTHER_USER_ID, USER_ID } from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("AuditLogRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted audit log", async () => {
      const [SAVED] = await seedAuditLogs();
      const SAVED_ID = SAVED.id as string;

      const FOUND = await newAuditLogRepository().findById(SAVED_ID);

      expect(FOUND?.equals(SAVED)).toBe(true);
      expect(FOUND?.entity).toBe(AUDIT_LOG.entity);
      expect(FOUND?.entityId).toBe(AUDIT_LOG.entityId);
      expect(FOUND?.action).toBe(AUDIT_LOG.action);
      expect(FOUND?.userId).toBe(AUDIT_LOG.userId);
    });

    it("returns null when the audit log does not exist", async () => {
      expect(await newAuditLogRepository().findById(USER_ID)).toBeNull();
    });
  });

  describe("findAllByEntity", () => {
    it("returns every audit log of the entity", async () => {
      await seedAuditLogs();

      const FOUND = await newAuditLogRepository().findAllByEntity("user");

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.entity).toBe(AUDIT_LOG.entity);
    });

    it("returns an empty array when no audit logs exist", async () => {
      expect(await newAuditLogRepository().findAllByEntity("user")).toEqual([]);
    });
  });

  describe("findAllByEntityAndEntityId", () => {
    it("returns the audit logs of the entity record", async () => {
      await seedAuditLogs();

      const FOUND = await newAuditLogRepository().findAllByEntityAndEntityId(
        "user",
        USER_ID,
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.entityId).toBe(USER_ID);
    });

    it("returns an empty array when the record has no audit logs", async () => {
      expect(
        await newAuditLogRepository().findAllByEntityAndEntityId(
          "user",
          USER_ID,
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByEntityAndEntityIds", () => {
    it("returns only the audit logs of the provided records", async () => {
      await seedAuditLogs();

      const FOUND = await newAuditLogRepository().findAllByEntityAndEntityIds(
        "user",
        [USER_ID],
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND.some((ROW) => ROW.entityId === USER_ID)).toBe(true);
      expect(
        FOUND.some((ROW) => ROW.entityId === OTHER_AUDIT_LOG.entityId),
      ).toBe(false);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newAuditLogRepository().findAllByEntityAndEntityIds("user", []),
      ).toEqual([]);
    });
  });

  describe("findAllByUserId", () => {
    it("returns every audit log performed by the user", async () => {
      await seedAuditLogs();

      const FOUND = await newAuditLogRepository().findAllByUserId(USER_ID);

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.userId).toBe(USER_ID);
    });

    it("returns an empty array when the user has no audit logs", async () => {
      expect(await newAuditLogRepository().findAllByUserId(USER_ID)).toEqual(
        [],
      );
    });
  });

  describe("findAllByUserIds", () => {
    it("returns the audit logs performed by any of the provided users", async () => {
      await seedAuditLogs();

      const FOUND = await newAuditLogRepository().findAllByUserIds([
        USER_ID,
        OTHER_USER_ID,
      ]);

      expect(FOUND).toHaveLength(2);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newAuditLogRepository().findAllByUserIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("always inserts a new audit log, generating a fresh id", async () => {
      await seedAuditLogs();

      const REPOSITORY = newAuditLogRepository();

      const FIRST = await REPOSITORY.save(AUDIT_LOG);
      const SECOND = await REPOSITORY.save(AUDIT_LOG);

      const FOUND = await REPOSITORY.findAllByUserId(USER_ID);

      expect(FIRST.id).not.toBe(SECOND.id);
      expect(FOUND).toHaveLength(3);
      expect(FOUND.every((ROW) => ROW.entity === "user")).toBe(true);
    });
  });
});
