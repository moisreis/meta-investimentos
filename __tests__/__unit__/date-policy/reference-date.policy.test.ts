import { describe, expect, it } from "vitest";

import {
  RangeReference,
  ReferenceDatePolicy,
} from "@/business/date-policy/reference-date.policy";

describe("ReferenceDatePolicy", () => {
  it("normalizes a date to its UTC calendar day", () => {
    const POLICY = new ReferenceDatePolicy();
    const DAY = POLICY.dayOf(new Date("2026-01-15T14:30:00.000Z"));

    expect(DAY.toISOString()).toBe("2026-01-15T00:00:00.000Z");
  });

  it("treats weekends as non-business days", () => {
    const POLICY = new ReferenceDatePolicy();
    // 2026-01-04 is a Sunday, 2026-01-05 a Monday
    expect(POLICY.isBusinessDay(new Date("2026-01-04T00:00:00.000Z"))).toBe(
      false,
    );
    expect(POLICY.isBusinessDay(new Date("2026-01-05T00:00:00.000Z"))).toBe(
      true,
    );
  });

  it("honors a holiday calendar", () => {
    const POLICY = new ReferenceDatePolicy({
      holidays: { isClosed: (d) => d.getUTCDate() === 5 },
    });
    expect(POLICY.isBusinessDay(new Date("2026-01-05T00:00:00.000Z"))).toBe(
      false,
    );
    expect(POLICY.isBusinessDay(new Date("2026-01-06T00:00:00.000Z"))).toBe(
      true,
    );
  });

  it("previousBusinessDay snaps back over a weekend", () => {
    const POLICY = new ReferenceDatePolicy();
    // 2026-01-04 Sunday -> previous business day is 2026-01-02 Friday
    const DAY = POLICY.previousBusinessDay(
      new Date("2026-01-04T00:00:00.000Z"),
    );
    expect(DAY.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("resolves a single date period to the anchor day", () => {
    const POLICY = new ReferenceDatePolicy();
    const SPAN = POLICY.resolve("date", new Date("2026-01-15T00:00:00.000Z"));
    expect(SPAN.start.toISOString()).toBe("2026-01-15T00:00:00.000Z");
    expect(SPAN.end.toISOString()).toBe("2026-01-15T00:00:00.000Z");
    expect(SPAN.period).toBe("date");
  });

  it("snaps a single date to the previous business day when requested", () => {
    const POLICY = new ReferenceDatePolicy();
    const SPAN = POLICY.resolve("date", new Date("2026-01-04T00:00:00.000Z"), {
      businessDay: true,
    });
    expect(SPAN.end.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("resolves a month to the first day through the anchor", () => {
    const POLICY = new ReferenceDatePolicy();
    const SPAN = POLICY.resolve("month", new Date("2026-01-15T00:00:00.000Z"));
    expect(SPAN.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(SPAN.end.toISOString()).toBe("2026-01-15T00:00:00.000Z");
  });

  it("resolves the year-to-date window", () => {
    const POLICY = new ReferenceDatePolicy();
    const SPAN = POLICY.resolve(
      "year-to-date",
      new Date("2026-03-10T00:00:00.000Z"),
    );
    expect(SPAN.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(SPAN.end.toISOString()).toBe("2026-03-10T00:00:00.000Z");
  });

  it("resolves the trailing 12 months window", () => {
    const POLICY = new ReferenceDatePolicy();
    const SPAN = POLICY.resolve(
      "trailing-12m",
      new Date("2026-03-10T00:00:00.000Z"),
    );
    // 12 months back from March 2026 = 2025-04-01
    expect(SPAN.start.toISOString()).toBe("2025-04-01T00:00:00.000Z");
    expect(SPAN.end.toISOString()).toBe("2026-03-10T00:00:00.000Z");
  });

  it("throws for the range period (use RangeReference instead)", () => {
    const POLICY = new ReferenceDatePolicy();
    expect(() =>
      POLICY.resolve("range", new Date("2026-01-15T00:00:00.000Z")),
    ).toThrow(/does not accept 'range'/);
  });

  it("businessDaysBetween enumerates weekdays only, ascending", () => {
    const POLICY = new ReferenceDatePolicy();
    // Fri 2026-01-02 .. Sun 2026-01-04 => [02, 05? no: 02 Fri, 03 Sat(no), 04 Sun(no)]
    const DAYS = POLICY.businessDaysBetween(
      new Date("2026-01-02T00:00:00.000Z"),
      new Date("2026-01-06T00:00:00.000Z"),
    );
    expect(DAYS.map((D) => D.toISOString().slice(0, 10))).toEqual([
      "2026-01-02",
      "2026-01-05",
      "2026-01-06",
    ]);
  });
});

describe("RangeReference", () => {
  it("builds a range span", () => {
    const RANGE = new RangeReference(
      new Date("2026-01-01T00:00:00.000Z"),
      new Date("2026-01-31T00:00:00.000Z"),
    );
    expect(RANGE.span.period).toBe("range");
    expect(RANGE.span.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(RANGE.span.end.toISOString()).toBe("2026-01-31T00:00:00.000Z");
  });

  it("rejects an inverted range", () => {
    expect(
      () =>
        new RangeReference(
          new Date("2026-02-01T00:00:00.000Z"),
          new Date("2026-01-31T00:00:00.000Z"),
        ),
    ).toThrow(/must not be after/);
  });
});
