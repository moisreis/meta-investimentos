import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryAuditLogRepository,
  ENTITY,
  ENTITY_ID,
  LOG,
  LOG_ID,
  USER_ID,
} from "@/__tests__/__helpers__/interfaces/_audit-log.test.helper";

import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import type { IAuditLog } from "@/business/interfaces/audit/audit-log.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IAuditLog", () => {
  let REPOSITORY: IAuditLog;

  beforeEach(() => {
    REPOSITORY = createInMemoryAuditLogRepository();
  });

  describe("findById", () => {
    it("returns the persisted log", async () => {
      await REPOSITORY.save(LOG);

      const FOUND = await REPOSITORY.findById(EntityId.create(LOG_ID));

      expect(FOUND?.equals(LOG)).toBe(true);
    });

    it("returns null when the log does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(LOG_ID))).toBeNull();
    });
  });

  describe("findAllByEntity", () => {
    it("returns all persisted logs for the entity", async () => {
      const SECOND_LOG = AuditLog.create(
        {
          entity: ENTITY,
          entityId: EntityId.create("9e8b4a21-b3d7-1c7e-9f0a-1c7e9f0a4b52"),
          action: "CREATED",
          userId: EntityId.create(USER_ID),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );

      await REPOSITORY.save(LOG);
      await REPOSITORY.save(SECOND_LOG);

      const FOUND = await REPOSITORY.findAllByEntity(ENTITY);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(LOG)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_LOG)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByEntity(ENTITY)).toEqual([]);
    });
  });

  describe("findAllByEntityAndEntityId", () => {
    it("returns all persisted logs for the entity and entity id", async () => {
      const SECOND_LOG = AuditLog.create(
        {
          entity: ENTITY,
          entityId: EntityId.create(ENTITY_ID),
          action: "CREATED",
          userId: EntityId.create(USER_ID),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );

      await REPOSITORY.save(LOG);
      await REPOSITORY.save(SECOND_LOG);

      const FOUND = await REPOSITORY.findAllByEntityAndEntityId(
        ENTITY,
        EntityId.create(ENTITY_ID),
      );

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(LOG)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_LOG)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByEntityAndEntityId(
          ENTITY,
          EntityId.create(ENTITY_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByUserId", () => {
    it("returns all persisted logs for the user", async () => {
      const SECOND_LOG = AuditLog.create(
        {
          entity: "Position",
          entityId: EntityId.create("9e8b4a21-b3d7-1c7e-9f0a-1c7e9f0a4b52"),
          action: "DELETED",
          userId: EntityId.create(USER_ID),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );

      await REPOSITORY.save(LOG);
      await REPOSITORY.save(SECOND_LOG);

      const FOUND = await REPOSITORY.findAllByUserId(EntityId.create(USER_ID));

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(LOG)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_LOG)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByUserId(EntityId.create(USER_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new log", async () => {
      await REPOSITORY.save(LOG);

      const FOUND = await REPOSITORY.findById(EntityId.create(LOG_ID));

      expect(FOUND?.equals(LOG)).toBe(true);
    });

    it("updates an existing log", async () => {
      await REPOSITORY.save(LOG);

      const UPDATED = AuditLog.create(
        {
          entity: ENTITY,
          entityId: EntityId.create(ENTITY_ID),
          action: "DELETED",
          userId: EntityId.create(USER_ID),
        },
        LOG_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(LOG_ID));

      expect(FOUND?.action).toBe("DELETED");
    });
  });
});
