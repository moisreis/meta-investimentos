import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ID } from "@/__tests__/__fixtures__";
import { installApiTestRuntime } from "@/__tests__/__helpers__/api/_api.test.runtime";
import { seedPortfolioById } from "@/__tests__/__seeds__/_portfolio.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import type { SendableEvent } from "@/app/api/_core/runtime";
import { POST as benchmarkRefresh } from "@/app/api/benchmarks/refresh/route";
import { POST as cvmImport } from "@/app/api/cvm/imports/route";
import { POST as fundQuoteRefresh } from "@/app/api/funds/refresh/route";
import { POST as calculate } from "@/app/api/portfolios/[portfolioId]/performance/calculations/route";

describe("API job requests", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("bounces performance calculations to the scheduler with 202", async () => {
    const events: SendableEvent[] = [];
    installApiTestRuntime({ onSend: (sent) => events.push(...sent) });
    await seedPortfolioById(ID.PORTFOLIO.DEFAULT);

    const response = await calculate(
      new Request(
        `http://localhost/api/portfolios/${ID.PORTFOLIO.DEFAULT}/performance/calculations`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ period: "date", anchor: "2026-09-01" }),
        },
      ),
      { params: Promise.resolve({ portfolioId: ID.PORTFOLIO.DEFAULT }) },
    );

    expect(response.status).toBe(202);
    const body = await response.json();
    expect(body.data.id).toBeTypeOf("string");
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe("performance/calculate.requested");
    expect((events[0].data as { portfolioId: string }).portfolioId).toBe(
      ID.PORTFOLIO.DEFAULT,
    );
  });

  it("forwards cvm import requests to the scheduler", async () => {
    const events: SendableEvent[] = [];
    installApiTestRuntime({ onSend: (sent) => events.push(...sent) });

    const response = await cvmImport(
      new Request("http://localhost/api/cvm/imports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ monthsBack: 3 }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(202);
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe("cvm/import.requested");
    expect((events[0].data as { monthsBack: number }).monthsBack).toBe(3);
  });

  it("forwards benchmark refresh requests to the scheduler", async () => {
    const events: SendableEvent[] = [];
    installApiTestRuntime({ onSend: (sent) => events.push(...sent) });

    const response = await benchmarkRefresh(
      new Request("http://localhost/api/benchmarks/refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startDate: "2026-01-01",
          endDate: "2026-01-31",
        }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(202);
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe("benchmark/refresh.requested");
  });

  it("forwards fund quote refresh requests to the scheduler", async () => {
    const events: SendableEvent[] = [];
    installApiTestRuntime({ onSend: (sent) => events.push(...sent) });

    const response = await fundQuoteRefresh(
      new Request("http://localhost/api/funds/refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: "2026-09-01" }),
      }),
      { params: Promise.resolve({}) },
    );

    expect(response.status).toBe(202);
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe("fund/refresh.quotes");
    expect((events[0].data as { date: string }).date).toBe("2026-09-01");
  });
});
