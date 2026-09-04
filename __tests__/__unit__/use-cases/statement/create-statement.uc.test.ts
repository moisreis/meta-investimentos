import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { createStatement } from "@/business/use-cases/statement/create-statement.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;
const PERIOD_START = new Date("2026-01-01T00:00:00.000Z");
const PERIOD_END = new Date("2026-01-31T00:00:00.000Z");

describe("createStatement", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a statement scoped to a portfolio as its owner", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await createStatement(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        periodStart: PERIOD_START,
        periodEnd: PERIOD_END,
        fileUrl: "https://example.com/statements/january.pdf",
      });

      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.periodStart).toBe(PERIOD_START);
      expect(RESULT.periodEnd).toBe(PERIOD_END);
      expect(RESULT.fileUrl).toBe("https://example.com/statements/january.pdf");
      expect(RESULT.generatedByUserId).toBe(ACTOR_ID);
    });

    it("creates a statement scoped to a portfolio as an editor", async () => {
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
        portfolioPermissions: [permission],
      });

      const RESULT = await createStatement(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        periodStart: PERIOD_START,
        periodEnd: PERIOD_END,
        fileUrl: "https://example.com/statements/january.pdf",
      });

      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.generatedByUserId).toBe(OTHER_ACTOR_ID);
    });

    it("creates a statement scoped to a portfolio as a viewer", async () => {
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
        portfolioPermissions: [permission],
      });

      const RESULT = await createStatement(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        periodStart: PERIOD_START,
        periodEnd: PERIOD_END,
        fileUrl: "https://example.com/statements/january.pdf",
      });

      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.generatedByUserId).toBe(OTHER_ACTOR_ID);
    });

    it("creates a statement without a portfolio when none is provided", async () => {
      const RESULT = await createStatement(unitOfWork as never, {
        actorId: ACTOR_ID,
        periodStart: PERIOD_START,
        periodEnd: PERIOD_END,
        fileUrl: "https://example.com/statements/january.pdf",
      });

      expect(RESULT.portfolioId).toBeNull();
      expect(RESULT.generatedByUserId).toBe(ACTOR_ID);
      expect(RESULT.fileUrl).toBe("https://example.com/statements/january.pdf");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await createStatement(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        periodStart: PERIOD_START,
        periodEnd: PERIOD_END,
        fileUrl: "https://example.com/statements/january.pdf",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("access denied", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        createStatement(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          periodStart: PERIOD_START,
          periodEnd: PERIOD_END,
          fileUrl: "https://example.com/statements/january.pdf",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user has no access to the portfolio", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        createStatement(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          periodStart: PERIOD_START,
          periodEnd: PERIOD_END,
          fileUrl: "https://example.com/statements/january.pdf",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the period start is after the period end", async () => {
      await expect(
        createStatement(unitOfWork as never, {
          actorId: ACTOR_ID,
          periodStart: PERIOD_END,
          periodEnd: PERIOD_START,
          fileUrl: "https://example.com/statements/january.pdf",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when the file url is blank", async () => {
      await expect(
        createStatement(unitOfWork as never, {
          actorId: ACTOR_ID,
          periodStart: PERIOD_START,
          periodEnd: PERIOD_END,
          fileUrl: "   ",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
