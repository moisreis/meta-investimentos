import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ID } from "@/__tests__/__fixtures__";
import { installApiTestRuntime } from "@/__tests__/__helpers__/api/_api.test.runtime";
import {
  seedPortfolioById,
  seedPortfolios,
} from "@/__tests__/__seeds__/_portfolio.seed";
import {
  OTHER_PORTFOLIO_PERMISSION,
  PORTFOLIO_PERMISSION,
  seedPortfolioPermission,
} from "@/__tests__/__seeds__/_portfolio-permission.seed";
import { seedUserById } from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { GET as getPortfolio } from "@/app/api/portfolios/[portfolioId]/route";
import {
  POST as createPortfolio,
  GET as listPortfolios,
} from "@/app/api/portfolios/route";
import type { ResolvedActor } from "@/business/use-cases/shared/actor-resolution";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const DEFAULT_USER: ResolvedActor = {
  actorId: EntityId.create(ID.USER.DEFAULT),
  role: "USER",
};

const OTHER_USER: ResolvedActor = {
  actorId: EntityId.create(ID.USER.OTHER),
  role: "USER",
};

describe("API portfolios", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("creates a portfolio owned by the actor", async () => {
    installApiTestRuntime({ actor: DEFAULT_USER });
    await seedUserById(ID.USER.DEFAULT);

    const response = await createPortfolio(
      new Request("http://localhost/api/portfolios", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: "10",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(201);
    const { data } = await response.json();
    expect(data.name).toBe("Fundo de Investimento em Ações");
    expect(data.id).toBeTypeOf("string");
  });

  it("lets the owner retrieve their portfolio", async () => {
    installApiTestRuntime({ actor: DEFAULT_USER });
    await seedPortfolioById(ID.PORTFOLIO.DEFAULT);

    const response = await getPortfolio(
      new Request(`http://localhost/api/portfolios/${ID.PORTFOLIO.DEFAULT}`),
      { params: Promise.resolve({ portfolioId: ID.PORTFOLIO.DEFAULT }) },
    );

    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data.id).toBe(ID.PORTFOLIO.DEFAULT);
  });

  it("lets a viewer retrieve a portfolio they can access", async () => {
    installApiTestRuntime({ actor: OTHER_USER });
    await seedPortfolioPermission(PORTFOLIO_PERMISSION);

    const response = await getPortfolio(
      new Request(`http://localhost/api/portfolios/${ID.PORTFOLIO.DEFAULT}`),
      { params: Promise.resolve({ portfolioId: ID.PORTFOLIO.DEFAULT }) },
    );

    expect(response.status).toBe(200);
  });

  it("hides portfolios the actor cannot access as 404", async () => {
    await seedPortfolioPermission(PORTFOLIO_PERMISSION);
    installApiTestRuntime({
      actor: { actorId: EntityId.create(ID.USER.DEFAULT), role: "USER" },
    });

    const response = await getPortfolio(
      new Request(`http://localhost/api/portfolios/${ID.PORTFOLIO.OTHER}`),
      { params: Promise.resolve({ portfolioId: ID.PORTFOLIO.OTHER }) },
    );

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("lists only the portfolios the actor can access", async () => {
    installApiTestRuntime({ actor: DEFAULT_USER });
    await seedPortfolios();
    await seedPortfolioPermission(PORTFOLIO_PERMISSION);
    await seedPortfolioPermission(OTHER_PORTFOLIO_PERMISSION);

    const response = await listPortfolios(
      new Request("http://localhost/api/portfolios"),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(200);
    const { data, meta } = await response.json();
    expect(data).toHaveLength(3);
    expect(meta.totalItems).toBe(3);
  });
});
