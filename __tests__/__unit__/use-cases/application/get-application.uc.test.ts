import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  APPLICATION,
  OTHER_APPLICATION,
} from "@/__tests__/__helpers__/interfaces/_application.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  OTHER_POSITION,
  POSITION,
} from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { getApplication } from "@/business/use-cases/application/get-application.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getApplication", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the application when the actor is the portfolio owner", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
      });

      const RESULT = await getApplication(unitOfWork as never, {
        actorId: ACTOR_ID,
        applicationId: ID.APPLICATION.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.APPLICATION.DEFAULT));
      expect(RESULT.positionId).toBe(EntityId.create(ID.POSITION.DEFAULT));
      expect(RESULT.amount).toBe("1000");
    });

    it("returns the application when the actor has EDITOR permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "EDITOR",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      const RESULT = await getApplication(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        applicationId: ID.APPLICATION.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.APPLICATION.DEFAULT));
    });

    it("returns the application when the actor has VIEWER permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "VIEWER",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      const RESULT = await getApplication(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        applicationId: ID.APPLICATION.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.APPLICATION.DEFAULT));
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the application does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        getApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the position does not exist", async () => {
      const APP = APPLICATION;
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        applications: [APP],
      });

      await expect(
        getApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
      });

      await expect(
        getApplication(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          applicationId: ID.APPLICATION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      const POS = OTHER_POSITION;
      const APP = OTHER_APPLICATION;
      unitOfWork.seed({
        users: [USER],
        positions: [POS],
        applications: [APP],
      });

      await expect(
        getApplication(unitOfWork as never, {
          actorId: ACTOR_ID,
          applicationId: ID.APPLICATION.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
