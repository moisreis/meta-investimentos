import { describe, expect, it } from "vitest";

import {
  buildBenchmarkRefresh,
  buildCvmImportRequest,
  buildFundQuoteRefresh,
  buildPerformanceCalculationRequest,
} from "@/infrastructure/inngest/requests";

describe("buildCvmImportRequest", () => {
  it("builds a sendable import request with a fresh id", () => {
    const event = buildCvmImportRequest({ monthsBack: 6 });

    expect(event.name).toBe("cvm/import.requested");
    expect(event.data.id).toBeDefined();
    expect(event.data.monthsBack).toBe(6);
  });

  it("builds a sendable id-only import request", () => {
    const event = buildCvmImportRequest();

    expect(event.name).toBe("cvm/import.requested");
    expect(event.data.id).toBeDefined();
  });

  it("rejects an invalid request", () => {
    expect(() => buildCvmImportRequest({ monthsBack: 0 })).toThrow();
  });
});

describe("buildFundQuoteRefresh", () => {
  it("builds a sendable quote refresh", () => {
    const event = buildFundQuoteRefresh({ date: "2026-09-04" });

    expect(event.name).toBe("fund/refresh.quotes");
    expect(event.data).toEqual({ date: "2026-09-04" });
  });

  it("rejects an invalid refresh", () => {
    expect(() => buildFundQuoteRefresh({ date: "nope" })).toThrow();
  });
});

describe("buildBenchmarkRefresh", () => {
  it("builds a sendable benchmark refresh", () => {
    const event = buildBenchmarkRefresh({
      startDate: "2026-01-01",
      endDate: "2026-06-30",
    });

    expect(event.name).toBe("benchmark/refresh.requested");
    expect(event.data).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-06-30",
    });
  });

  it("rejects an invalid range", () => {
    expect(() =>
      buildBenchmarkRefresh({ startDate: "2026-06-30", endDate: "2026-01-01" }),
    ).toThrow();
  });
});

describe("buildPerformanceCalculationRequest", () => {
  it("builds a sendable calculation request with a fresh id", () => {
    const event = buildPerformanceCalculationRequest({
      portfolioId: "p-1",
      period: "date",
      anchor: "2026-09-04",
      businessDay: true,
    });

    expect(event.name).toBe("performance/calculate.requested");
    expect(event.data.id).toBeDefined();
    expect(event.data.portfolioId).toBe("p-1");
    expect(event.data.period).toBe("date");
    expect(event.data.businessDay).toBe(true);
  });

  it("builds a sendable range calculation", () => {
    const event = buildPerformanceCalculationRequest({
      portfolioId: "p-2",
      period: "range",
      anchor: "2026-01-01",
      endDate: "2026-06-30",
    });

    expect(event.data.endDate).toBe("2026-06-30");
  });

  it("rejects an invalid request", () => {
    expect(() =>
      buildPerformanceCalculationRequest({
        portfolioId: "p-1",
        period: "range",
        anchor: "2026-01-01",
      }),
    ).toThrow();
  });
});
