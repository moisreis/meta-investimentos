import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  APPLICATION,
  UPDATED_APPLICATION,
} from "@/__tests__/__helpers__/interfaces/_application.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { reverseApplication } from "@/business/use-cases/application/reverse-application.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("reverseApplication", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("reverses an application and records the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
      });

      const RESULT = await reverseApplication(unitOfWork as never, {
        actorId: ACTOR_ID,
        applicationId: ID.APPLICATION.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.APPLICATION.DEFAULT);
      expect(RESULT.amount).toBe("1000");
      expect(RESULT.reversedAt).not.toBeNull();
      expect(RESULT.reversedByUserId).toBe(EntityId.create(ACTOR_ID));

      const saved = await unitOfWork.applications.findById(
        EntityId.create(ID.APPLICATION.DEFAULT),
      );
      expect(saved?.reversedAt).not.toBeNull();
      expect(saved?.reversedByUserId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
      });

      await expect(
        reverseApplication(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          applicationId: ID.APPLICATION.DEFAULT,
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
        applications: [APPLICATION],
        portfolioPermissions: [VIEWER as never],
      });

      await expect(
        reverseApplication(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the application does not exist", async () => {
      await expect(
        reverseApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the application is already reversed", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [UPDATED_APPLICATION],
      });

      await expect(
        reverseApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("rollback", () => {
    it("does not persist the reversal when validation fails", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [UPDATED_APPLICATION],
      });

      const REVERSAL_DATE = UPDATED_APPLICATION.reversedAt;

      await expect(
        reverseApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);

      const saved = await unitOfWork.applications.findById(
        EntityId.create(ID.APPLICATION.DEFAULT),
      );
      expect(saved?.reversedAt).toEqual(REVERSAL_DATE);
    });
  });
});
