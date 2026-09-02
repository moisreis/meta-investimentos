import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { newAuditLogRepository } from "@/__tests__/__helpers__/repositories/_audit.test.helper";
import {
  FRESH_APPLICATION,
  newApplicationRepository,
  newPositionRepository,
  POSITION,
  POSITION_ID,
  seedPositionById,
  UPDATED_POSITION,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import { FRESH_POSITION_PERFORMANCE } from "@/__tests__/__seeds__/_position-performance.seed";
import { seedUserById, USER_ID } from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  db,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { Application } from "@/business/entities/portfolio/application.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { UnitOfWork } from "@/infrastructure/unit-of-work";

describe("UnitOfWork", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("run", () => {
    it("commits every mutation performed by the worker", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      let savedApplicationId: string | undefined;

      const APPLICATION = await UNIT_OF_WORK.run(async (tx) => {
        const SAVED = await tx.applications.save(FRESH_APPLICATION);

        savedApplicationId = SAVED.id;

        await tx.positions.save(UPDATED_POSITION);
        await tx.positionPerformances.save(FRESH_POSITION_PERFORMANCE);

        return SAVED;
      });

      expect(
        (
          await newApplicationRepository().findById(
            EntityId.create(savedApplicationId as string),
          )
        )?.equals(APPLICATION),
      ).toBe(true);

      const POSITION_ROW = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(POSITION_ROW?.equals(UPDATED_POSITION)).toBe(true);
    });

    it("rolls back every mutation when the worker throws", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      await expect(
        UNIT_OF_WORK.run(async (tx) => {
          await tx.applications.save(FRESH_APPLICATION);
          await tx.positions.save(UPDATED_POSITION);

          throw new Error("Atomic operation failed.");
        }),
      ).rejects.toThrow("Atomic operation failed.");

      expect(
        await newApplicationRepository().findAllByPositionId(
          EntityId.create(POSITION_ID),
        ),
      ).toEqual([]);

      const POSITION_ROW = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(POSITION_ROW?.equals(POSITION)).toBe(true);
    });
  });

  describe("audit trail", () => {
    it("records a CREATED audit row for a new entity saved through the unit of work", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      let savedId: string | undefined;

      await UNIT_OF_WORK.run(async (tx) => {
        const SAVED = await tx.applications.save(FRESH_APPLICATION);

        savedId = SAVED.id as string;
      });

      const LOGS = await newAuditLogRepository().findAllByEntityAndEntityId(
        "Application",
        EntityId.create(savedId as string),
      );

      expect(LOGS).toHaveLength(1);
      expect(LOGS[0]?.action).toBe("CREATED");
    });

    it("records an UPDATED audit row when an existing entity is saved", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      await UNIT_OF_WORK.run(async (tx) => {
        await tx.positions.save(UPDATED_POSITION);
      });

      const LOGS = await newAuditLogRepository().findAllByEntityAndEntityId(
        "Position",
        EntityId.create(POSITION_ID),
      );

      expect(LOGS).toHaveLength(1);
      expect(LOGS[0]?.action).toBe("UPDATED");
    });

    it("records a DELETED audit row when an entity is deleted", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      await UNIT_OF_WORK.run(async (tx) => {
        await tx.positions.delete(EntityId.create(POSITION_ID));
      });

      const LOGS = await newAuditLogRepository().findAllByEntityAndEntityId(
        "Position",
        EntityId.create(POSITION_ID),
      );

      expect(LOGS).toHaveLength(1);
      expect(LOGS[0]?.action).toBe("DELETED");
    });

    it("attributes the audit rows to the acting user", async () => {
      await seedUserById(USER_ID);
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      await UNIT_OF_WORK.run(
        async (tx) => {
          await tx.positions.save(UPDATED_POSITION);
        },
        { userId: EntityId.create(USER_ID) },
      );

      const LOGS = await newAuditLogRepository().findAllByUserId(
        EntityId.create(USER_ID),
      );

      expect(LOGS).toHaveLength(1);
      expect(LOGS[0]?.entity).toBe("Position");
      expect(
        EntityId.equals(
          LOGS[0]?.entityId as EntityId,
          EntityId.create(POSITION_ID),
        ),
      ).toBe(true);
      expect(
        EntityId.equals(LOGS[0]?.userId as EntityId, EntityId.create(USER_ID)),
      ).toBe(true);
    });

    it("rolls back the audit rows together with the mutations", async () => {
      await seedPositionById(POSITION_ID);

      const UNIT_OF_WORK = new UnitOfWork(db);

      await expect(
        UNIT_OF_WORK.run(async (tx) => {
          await tx.positions.save(UPDATED_POSITION);

          throw new Error("Atomic operation failed.");
        }),
      ).rejects.toThrow("Atomic operation failed.");

      expect(
        await newAuditLogRepository().findAllByEntityAndEntityId(
          "Position",
          EntityId.create(POSITION_ID),
        ),
      ).toEqual([]);
    });

    it("persists a reversal whose actor is a registered user", async () => {
      await seedUserById(USER_ID);
      await seedPositionById(POSITION_ID);

      const REVERSED_APPLICATION = Application.create({
        positionId: EntityId.create(POSITION_ID),
        date: new Date("2026-05-01T00:00:00.000Z"),
        amount: PositiveMoney.create("300.00"),
        quotas: QuotaQuantity.create("3.5"),
        reversedAt: new Date("2026-05-05T00:00:00.000Z"),
        reversedByUserId: EntityId.create(USER_ID),
      });

      const UNIT_OF_WORK = new UnitOfWork(db);

      const savedId = await UNIT_OF_WORK.run(async (tx) => {
        const SAVED = await tx.applications.save(REVERSED_APPLICATION);

        return SAVED.id as string;
      });

      const FOUND = await newApplicationRepository().findById(
        EntityId.create(savedId),
      );

      expect(
        EntityId.equals(
          FOUND?.reversedByUserId as EntityId,
          EntityId.create(USER_ID),
        ),
      ).toBe(true);
    });

    it("rejects a reversal whose actor is not a registered user", async () => {
      await seedPositionById(POSITION_ID);

      const REVERSED_APPLICATION = Application.create({
        positionId: EntityId.create(POSITION_ID),
        date: new Date("2026-05-01T00:00:00.000Z"),
        amount: PositiveMoney.create("300.00"),
        quotas: QuotaQuantity.create("3.5"),
        reversedAt: new Date("2026-05-05T00:00:00.000Z"),
        reversedByUserId: EntityId.create(
          "8e9f0a1b-2c3d-4e5f-9a8b-7c6d5e4f3a2b",
        ),
      });

      const UNIT_OF_WORK = new UnitOfWork(db);

      await expect(
        UNIT_OF_WORK.run(async (tx) => {
          await tx.applications.save(REVERSED_APPLICATION);
        }),
      ).rejects.toThrow();
    });
  });
});
