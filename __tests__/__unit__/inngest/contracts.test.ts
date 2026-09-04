import { describe, expect, it } from "vitest";

import {
  assertBenchmarkRefresh,
  assertCvmImportFundRequested,
  assertCvmImportRequested,
  assertFundQuoteRefresh,
  assertJobHealthCheck,
  assertPerformanceCalculateDaily,
  assertPerformanceCalculateRequested,
  assertRetryFailedJobs,
  isIsoDateString,
} from "@/infrastructure/inngest/contracts";

describe("isIsoDateString", () => {
  it.each([
    ["2026-09-04"],
    ["2000-01-01"],
    ["2028-02-29"],
  ])("accepts %s", (value) => {
    expect(isIsoDateString(value)).toBe(true);
  });

  it.each([
    ["09/04/2026"],
    ["2026-13-01"],
    ["2026-02-30"],
    ["2026-9-04"],
    [20260904],
    [null],
  ])("rejects %j", (value) => {
    expect(isIsoDateString(value)).toBe(false);
  });
});

describe("assertCvmImportRequested", () => {
  it("validates a full import request", () => {
    const payload = assertCvmImportRequested({
      id: "req-1",
      monthsBack: 6,
      requestedStart: "2026-01-01",
      requestedEnd: "2026-06-30",
      requestedCnpjs: ["08.267.224/0001-03"],
    });

    expect(payload).toMatchObject({
      id: "req-1",
      monthsBack: 6,
      requestedStart: "2026-01-01",
      requestedEnd: "2026-06-30",
      requestedCnpjs: ["08.267.224/0001-03"],
    });
  });

  it("accepts an id-only request", () => {
    expect(assertCvmImportRequested({ id: "req-1" })).toEqual({
      id: "req-1",
    });
  });

  it.each([
    [{ requestedStart: "2026-06-30", requestedEnd: "2026-01-01" }],
    [{ id: "  " }],
    [{ id: "req-1", monthsBack: 0 }],
    [{ id: "req-1", monthsBack: 37 }],
    [{ id: "req-1", monthsBack: 1.5 }],
    [{ id: "req-1", requestedCnpjs: [""] }],
    [{ id: "req-1", requestedStart: "2026-13-01" }],
  ])("rejects %j", (data) => {
    expect(() => assertCvmImportRequested(data)).toThrow();
  });

  it("rejects a non-object payload", () => {
    expect(() => assertCvmImportRequested("nope")).toThrow(
      "Event payload must be an object.",
    );
  });
});

describe("assertCvmImportFundRequested", () => {
  it("validates a per-fund import request", () => {
    const payload = assertCvmImportFundRequested({
      id: "req-1",
      fundCnpj: "08.267.224/0001-03",
      monthsBack: 2,
    });

    expect(payload).toEqual({
      id: "req-1",
      fundCnpj: "08.267.224/0001-03",
      monthsBack: 2,
    });
  });

  it.each([
    [{ id: "req-1" }],
    [{ id: "req-1", fundCnpj: " " }],
    [{ id: "req-1", fundCnpj: "08.267.224/0001-03", monthsBack: -1 }],
  ])("rejects %j", (data) => {
    expect(() => assertCvmImportFundRequested(data)).toThrow();
  });
});

describe("assertFundQuoteRefresh", () => {
  it("validates a refresh with a subset of funds", () => {
    const payload = assertFundQuoteRefresh({
      date: "2026-09-04",
      requestedCnpjs: ["08.267.224/0001-03"],
    });

    expect(payload).toMatchObject({ date: "2026-09-04" });
  });

  it("accepts an empty refresh", () => {
    expect(assertFundQuoteRefresh({})).toEqual({});
  });

  it("rejects a malformed date", () => {
    expect(() => assertFundQuoteRefresh({ date: "09/04/2026" })).toThrow(
      "Event payload field 'date' must be a YYYY-MM-DD date.",
    );
  });
});

describe("assertBenchmarkRefresh", () => {
  it("validates a benchmark refresh range", () => {
    expect(
      assertBenchmarkRefresh({
        startDate: "2026-01-01",
        endDate: "2026-06-30",
      }),
    ).toEqual({ startDate: "2026-01-01", endDate: "2026-06-30" });
  });

  it("accepts an empty refresh", () => {
    expect(assertBenchmarkRefresh({})).toEqual({
      startDate: undefined,
      endDate: undefined,
    });
  });

  it("rejects a reversed range", () => {
    expect(() =>
      assertBenchmarkRefresh({
        startDate: "2026-06-30",
        endDate: "2026-01-01",
      }),
    ).toThrow(
      "Event payload benchmark refresh start must not be after its end.",
    );
  });
});

describe("assertPerformanceCalculateRequested", () => {
  it("validates a date-period calculation", () => {
    const payload = assertPerformanceCalculateRequested({
      id: "calc-1",
      portfolioId: "p-1",
      period: "date",
      anchor: "2026-09-04",
      businessDay: true,
    });

    expect(payload).toMatchObject({
      id: "calc-1",
      portfolioId: "p-1",
      period: "date",
      anchor: "2026-09-04",
      businessDay: true,
    });
  });

  it("validates a range calculation with an end date", () => {
    const payload = assertPerformanceCalculateRequested({
      id: "calc-2",
      portfolioId: "p-2",
      period: "range",
      anchor: "2026-01-01",
      endDate: "2026-06-30",
    });

    expect(payload.endDate).toBe("2026-06-30");
  });

  it("rejects a range without an end date", () => {
    expect(() =>
      assertPerformanceCalculateRequested({
        id: "calc-3",
        portfolioId: "p-1",
        period: "range",
        anchor: "2026-01-01",
      }),
    ).toThrow(
      "Event payload field 'endDate' is required when period is 'range'.",
    );
  });

  it("rejects an end date on a non-range period", () => {
    expect(() =>
      assertPerformanceCalculateRequested({
        id: "calc-4",
        portfolioId: "p-1",
        period: "month",
        anchor: "2026-09-04",
        endDate: "2026-09-30",
      }),
    ).toThrow(
      "Event payload field 'endDate' is only valid when period is 'range'.",
    );
  });

  it.each([
    [
      {
        id: "c",
        portfolioId: "p",
        period: "range",
        anchor: "2026-07-01",
        endDate: "2026-01-01",
      },
    ],
    [{ id: "c", portfolioId: "p", period: "decade", anchor: "2026-01-01" }],
    [{ id: "c", portfolioId: "p", period: "date", anchor: "2026-13-01" }],
    [{ id: "c", portfolioId: " ", period: "date", anchor: "2026-01-01" }],
  ])("rejects %j", (data) => {
    expect(() => assertPerformanceCalculateRequested(data)).toThrow();
  });
});

describe("assertPerformanceCalculateDaily", () => {
  it("validates a daily roll-up", () => {
    expect(assertPerformanceCalculateDaily({ date: "2026-09-04" })).toEqual({
      date: "2026-09-04",
    });
  });

  it("rejects a missing date", () => {
    expect(() => assertPerformanceCalculateDaily({})).toThrow(
      "Event payload field 'date' is required.",
    );
  });
});

describe("assertRetryFailedJobs", () => {
  it("validates a retry sweep", () => {
    expect(assertRetryFailedJobs({ date: "2026-09-04", limit: 50 })).toEqual({
      date: "2026-09-04",
      limit: 50,
    });
  });

  it("accepts a sweep without a limit", () => {
    expect(assertRetryFailedJobs({ date: "2026-09-04" })).toEqual({
      date: "2026-09-04",
    });
  });

  it.each([
    { date: "2026-09-04", limit: 0 },
    { date: "2026-09-04", limit: 1001 },
  ])("rejects %j", (data) => {
    expect(() => assertRetryFailedJobs(data)).toThrow(
      "Event payload field 'limit' must be an integer between 1 and 1000.",
    );
  });
});

describe("assertJobHealthCheck", () => {
  it("validates a health check", () => {
    expect(assertJobHealthCheck({ date: "2026-09-04" })).toEqual({
      date: "2026-09-04",
    });
  });

  it("rejects a malformed date", () => {
    expect(() => assertJobHealthCheck({ date: "yesterday" })).toThrow();
  });
});
