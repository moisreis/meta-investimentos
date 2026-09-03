import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { QUOTA } from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createApplication } from "@/business/use-cases/application/create-application.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const APPLICATION_DATE = new Date("2026-01-05T00:00:00.000Z");

describe("createApplication", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates an application with the computed quota quantity", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [QUOTA],
      });

      const RESULT = await createApplication(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        date: APPLICATION_DATE,
        amount: "2000.00",
      });

      expect(RESULT.positionId).toBe(ID.POSITION.DEFAULT);
      expect(RESULT.amount).toBe("2000");
      expect(RESULT.quotas).toBe("2");

      const saved = await unitOfWork.applications.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [QUOTA],
      });

      await createApplication(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        date: APPLICATION_DATE,
        amount: "1000.00",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [QUOTA],
      });

      await expect(
        createApplication(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
          date: APPLICATION_DATE,
          amount: "1000.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("rejects a viewer role when mutating", async () => {
      const VIEWER = {
        id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "VIEWER" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [QUOTA],
        portfolioPermissions: [VIEWER as never],
      });

      await expect(
        createApplication(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
          date: APPLICATION_DATE,
          amount: "1000.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      await expect(
        createApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: APPLICATION_DATE,
          amount: "1000.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the fund has no quota on the date", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        createApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: APPLICATION_DATE,
          amount: "1000.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("rollback", () => {
    it("does not persist the application when validation fails", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        createApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: APPLICATION_DATE,
          amount: "1000.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);

      const applications = await unitOfWork.applications.findAllByPositionId(
        EntityId.create(ID.POSITION.DEFAULT),
      );
      expect(applications).toHaveLength(0);
    });
  });

  describe("financial invariant", () => {
    it("divides the amount by the quota price to derive the quota quantity", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [QUOTA],
      });

      const RESULT = await createApplication(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        date: APPLICATION_DATE,
        amount: "1500.00",
      });

      expect(RESULT.quotas).toBe("1.5");
    });
  });
});
