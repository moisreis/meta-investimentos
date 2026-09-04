import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { User } from "@/business/entities/user/user.entity";
import { grantPortfolioAccess } from "@/business/use-cases/user/grant-portfolio-access.uc";
import { listPortfolioAccess } from "@/business/use-cases/user/list-portfolio-access.uc";
import { revokePortfolioAccess } from "@/business/use-cases/user/revoke-portfolio-access.uc";
import { updatePortfolioAccess } from "@/business/use-cases/user/update-portfolio-access.uc";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const OWNER_ID = ID.USER.DEFAULT;
const TARGET_USER_ID = ID.USER.OTHER;
const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

const OWNER = User.create(
  {
    name: "José da Silva",
    email: "jose@example.com",
    firstName: "José",
    lastName: "da Silva",
    cpf: CPF.create("52998224725"),
  },
  OWNER_ID,
);

const TARGET_USER = User.create(
  {
    name: "Maria Souza",
    email: "maria@example.com",
    firstName: "Maria",
    lastName: "Souza",
    cpf: CPF.create("12345678909"),
  },
  TARGET_USER_ID,
);

const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create(OWNER_ID),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  PORTFOLIO_ID,
);

function seedOwnerContext(unitOfWork: FakeUnitOfWork): void {
  unitOfWork.seed({
    users: [OWNER, TARGET_USER],
    portfolios: [PORTFOLIO],
  });
}

function permission(role: "VIEWER" | "EDITOR"): PortfolioPermission {
  return PortfolioPermission.create(
    {
      userId: EntityId.create(TARGET_USER_ID),
      portfolioId: EntityId.create(PORTFOLIO_ID),
      role,
      grantedByUserId: EntityId.create(OWNER_ID),
    },
    "01a2b3c4-5d6e-4f7a-8b9c-0d1e2f3a4b5c",
  );
}

describe("grantPortfolioAccess", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("grants the owner's access to another user", async () => {
      seedOwnerContext(unitOfWork);

      const RESULT = await grantPortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        userId: TARGET_USER_ID,
        portfolioId: PORTFOLIO_ID,
        role: "VIEWER",
      });

      expect(RESULT.userId).toBe(EntityId.create(TARGET_USER_ID));
      expect(RESULT.portfolioId).toBe(EntityId.create(PORTFOLIO_ID));
      expect(RESULT.role).toBe("VIEWER");
      expect(RESULT.grantedByUserId).toBe(EntityId.create(OWNER_ID));
    });

    it("attributes the grant to the actor", async () => {
      seedOwnerContext(unitOfWork);

      await grantPortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        userId: TARGET_USER_ID,
        portfolioId: PORTFOLIO_ID,
        role: "EDITOR",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(OWNER_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor is not the owner", async () => {
      unitOfWork.seed({
        users: [OWNER, TARGET_USER],
        portfolios: [
          Portfolio.create(
            {
              acronym: "RF",
              name: "Renda Fixa",
              userId: EntityId.create(OWNER_ID),
              annualInterestRate: SignedPercentage.create("8"),
              minAllocation: SignedPercentage.create("10"),
              maxAllocation: SignedPercentage.create("30"),
              targetAllocation: SignedPercentage.create("18"),
            },
            ID.PORTFOLIO.OTHER,
          ),
        ],
      });

      await expect(
        grantPortfolioAccess(unitOfWork as never, {
          actorId: TARGET_USER_ID,
          userId: OWNER_ID,
          portfolioId: ID.PORTFOLIO.OTHER,
          role: "VIEWER",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      seedOwnerContext(unitOfWork);

      await expect(
        grantPortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: TARGET_USER_ID,
          portfolioId: ID.PORTFOLIO.THIRD,
          role: "VIEWER",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws NotFoundError when the granted user does not exist", async () => {
      unitOfWork.seed({ users: [OWNER], portfolios: [PORTFOLIO] });

      await expect(
        grantPortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
          role: "VIEWER",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when granting access to the owner", async () => {
      seedOwnerContext(unitOfWork);

      await expect(
        grantPortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: OWNER_ID,
          portfolioId: PORTFOLIO_ID,
          role: "VIEWER",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when access is already granted", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      await expect(
        grantPortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
          role: "EDITOR",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});

describe("updatePortfolioAccess", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the role of an existing permission", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      const RESULT = await updatePortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        userId: TARGET_USER_ID,
        portfolioId: PORTFOLIO_ID,
        role: "EDITOR",
      });

      expect(RESULT.role).toBe("EDITOR");
    });
  });

  describe("authorization and validation", () => {
    it("throws NotFoundError when the actor is not the owner", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      await expect(
        updatePortfolioAccess(unitOfWork as never, {
          actorId: TARGET_USER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
          role: "EDITOR",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the permission does not exist", async () => {
      seedOwnerContext(unitOfWork);

      await expect(
        updatePortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
          role: "EDITOR",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});

describe("revokePortfolioAccess", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("removes the permission", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      await revokePortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        userId: TARGET_USER_ID,
        portfolioId: PORTFOLIO_ID,
      });

      expect(
        await unitOfWork.portfolioPermissions.findByUserIdAndPortfolioId(
          EntityId.create(TARGET_USER_ID),
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toBeNull();
    });
  });

  describe("authorization and validation", () => {
    it("throws NotFoundError when the actor is not the owner", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      await expect(
        revokePortfolioAccess(unitOfWork as never, {
          actorId: TARGET_USER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the permission does not exist", async () => {
      seedOwnerContext(unitOfWork);

      await expect(
        revokePortfolioAccess(unitOfWork as never, {
          actorId: OWNER_ID,
          userId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});

describe("listPortfolioAccess", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the access entries with the granted user profile", async () => {
      seedOwnerContext(unitOfWork);
      const GRANTED = permission("EDITOR");
      unitOfWork.seed({ portfolioPermissions: [GRANTED] });

      const RESULT = await listPortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        portfolioId: PORTFOLIO_ID,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].userId).toBe(EntityId.create(TARGET_USER_ID));
      expect(RESULT[0].userName).toBe(TARGET_USER.name);
      expect(RESULT[0].userEmail).toBe(TARGET_USER.email);
      expect(RESULT[0].role).toBe("EDITOR");
    });

    it("returns an empty list when no access is granted", async () => {
      seedOwnerContext(unitOfWork);

      const RESULT = await listPortfolioAccess(unitOfWork as never, {
        actorId: OWNER_ID,
        portfolioId: PORTFOLIO_ID,
      });

      expect(RESULT).toEqual([]);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor is not the owner", async () => {
      seedOwnerContext(unitOfWork);
      unitOfWork.seed({ portfolioPermissions: [permission("VIEWER")] });

      await expect(
        listPortfolioAccess(unitOfWork as never, {
          actorId: TARGET_USER_ID,
          portfolioId: PORTFOLIO_ID,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
