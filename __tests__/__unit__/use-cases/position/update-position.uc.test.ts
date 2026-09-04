import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { updatePosition } from "@/business/use-cases/position/update-position.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("updatePosition", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("sets the initial balance as the portfolio owner", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      const RESULT = await updatePosition(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        initialBalance: "5000.00",
        initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
      });

      expect(RESULT.initialBalance).toBe("5000");
      expect(RESULT.initialBalanceDate).toEqual(
        new Date("2026-01-10T00:00:00.000Z"),
      );
    });

    it("sets the initial balance as an editor", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(OTHER_ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          role: "EDITOR",
          grantedByUserId: EntityId.create(ACTOR_ID),
        },
        ID.PORTFOLIO.OTHER,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        portfolioPermissions: [permission],
      });

      const RESULT = await updatePosition(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        initialBalance: "3000.00",
        initialBalanceDate: new Date("2026-02-01T00:00:00.000Z"),
      });

      expect(RESULT.initialBalance).toBe("3000");
    });

    it("attributes the mutation to the actor", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      await updatePosition(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        initialBalance: "5000.00",
        initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("access denied", () => {
    it("throws NotFoundError for a viewer", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(OTHER_ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          role: "VIEWER",
          grantedByUserId: EntityId.create(ACTOR_ID),
        },
        ID.PORTFOLIO.OTHER,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        portfolioPermissions: [permission],
      });

      await expect(
        updatePosition(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          initialBalance: "5000.00",
          initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user has no access", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      await expect(
        updatePosition(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          initialBalance: "5000.00",
          initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePosition(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          initialBalance: "5000.00",
          initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({ positions: [position] });

      await expect(
        updatePosition(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          initialBalance: "5000.00",
          initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
