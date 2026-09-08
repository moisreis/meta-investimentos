import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { AuditLog } from "@/business/entities/audit/audit-log.entity";
import { listNotifications } from "@/business/use-cases/audit/list-notifications.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const ACTOR_ID = EntityId.create(ID.USER.DEFAULT);
const OTHER_USER_ID = EntityId.create(ID.USER.OTHER);
const PORTFOLIO_ID = EntityId.create(ID.PORTFOLIO.DEFAULT);

const LOG_A_ID = EntityId.create("11111111-1111-4111-8111-111111111111");
const LOG_B_ID = EntityId.create("22222222-2222-4222-8222-222222222222");
const LOG_C_ID = EntityId.create("33333333-3333-4333-8333-333333333333");
const LOG_D_ID = EntityId.create("44444444-4444-4444-8444-444444444444");
const LOG_E_ID = EntityId.create("55555555-5555-4555-8555-555555555555");

const ANCHOR = new Date("2026-06-01T00:00:00.000Z");
const HOUR_MS = 60 * 60 * 1000;

/**
 * Builds an audit log entry attributed to the acting user.
 *
 * @param createdAt - The action timestamp.
 * @param action - The audit action, e.g. `"CREATED"`.
 * @param id - The log identifier.
 * @returns A valid `AuditLog` instance.
 */
function notificationLog(
  createdAt: Date,
  action = "CREATED",
  id = LOG_A_ID,
): AuditLog {
  return AuditLog.create(
    {
      entity: "Portfolio",
      entityId: PORTFOLIO_ID,
      action,
      userId: ACTOR_ID,
      createdAt,
    },
    id,
  );
}

describe("listNotifications", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the acting user's audit entries ordered most recent first", async () => {
      unitOfWork.seed({
        auditLogs: [
          notificationLog(
            new Date(ANCHOR.getTime() - 2 * HOUR_MS),
            "CREATED",
            LOG_A_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 50 * 60 * 1000),
            "UPDATED",
            LOG_B_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 10 * 60 * 1000),
            "DELETED",
            LOG_C_ID,
          ),
        ],
      });

      const RESULT = await listNotifications(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        since: new Date(ANCHOR.getTime() - 3 * HOUR_MS),
      });

      expect(RESULT).toHaveLength(3);
      expect(RESULT.map((notification) => notification.action)).toEqual([
        "DELETED",
        "UPDATED",
        "CREATED",
      ]);
    });

    it("returns an empty feed when the acting user has no audit entries", async () => {
      unitOfWork.seed({
        auditLogs: [
          AuditLog.create(
            {
              entity: "Portfolio",
              entityId: PORTFOLIO_ID,
              action: "READ",
              userId: OTHER_USER_ID,
              createdAt: new Date(ANCHOR.getTime() - HOUR_MS),
            },
            LOG_A_ID,
          ),
        ],
      });

      const RESULT = await listNotifications(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });

    it("returns an empty feed when every audit entry predates the since window", async () => {
      unitOfWork.seed({
        auditLogs: [
          notificationLog(
            new Date(ANCHOR.getTime() - 10 * 24 * HOUR_MS),
            "CREATED",
            LOG_A_ID,
          ),
        ],
      });

      const RESULT = await listNotifications(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        since: ANCHOR,
      });

      expect(RESULT).toHaveLength(0);
    });

    it("caps the feed at the requested limit, keeping the newest entries", async () => {
      unitOfWork.seed({
        auditLogs: [
          notificationLog(
            new Date(ANCHOR.getTime() - 50 * 60 * 1000),
            "READ",
            LOG_A_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 40 * 60 * 1000),
            "READ",
            LOG_B_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 30 * 60 * 1000),
            "READ",
            LOG_C_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 20 * 60 * 1000),
            "READ",
            LOG_D_ID,
          ),
          notificationLog(
            new Date(ANCHOR.getTime() - 10 * 60 * 1000),
            "READ",
            LOG_E_ID,
          ),
        ],
      });

      const RESULT = await listNotifications(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        since: new Date(ANCHOR.getTime() - HOUR_MS),
        limit: 3,
      });

      expect(RESULT).toHaveLength(3);
      expect(RESULT.map((notification) => notification.id)).toEqual([
        LOG_E_ID,
        LOG_D_ID,
        LOG_C_ID,
      ]);
    });
  });

  describe("mapping", () => {
    it("maps each audit entry to its notification DTO", async () => {
      const CREATED_AT = new Date(ANCHOR.getTime() - HOUR_MS);
      unitOfWork.seed({
        auditLogs: [notificationLog(CREATED_AT, "CREATED", LOG_A_ID)],
      });

      const RESULT = await listNotifications(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        since: new Date(ANCHOR.getTime() - 3 * HOUR_MS),
      });

      expect(RESULT).toEqual([
        {
          id: LOG_A_ID,
          entity: "Portfolio",
          entityId: PORTFOLIO_ID,
          action: "CREATED",
          createdAt: CREATED_AT.toISOString(),
        },
      ]);
    });
  });
});
