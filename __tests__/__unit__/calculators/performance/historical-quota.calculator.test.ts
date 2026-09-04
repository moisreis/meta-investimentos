import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  resolveQuoteAtOrBefore,
  snapshotDates,
} from "@/business/calculators/performance/historical-quota.calculator";
import { Quota } from "@/business/entities/fund/quota.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

const FUND = EntityId.create(ID.FUND.DEFAULT);

function makeQuota(date: Date, price: string): Quota {
  return Quota.create({ fundId: FUND, date, price: QuotaPrice.create(price) });
}

describe("resolveQuoteAtOrBefore", () => {
  it("returns the exact quote when present", () => {
    const QUOTAS = [
      makeQuota(new Date("2026-01-03T00:00:00.000Z"), "100"),
      makeQuota(new Date("2026-01-05T00:00:00.000Z"), "110"),
    ];

    const PRICE = resolveQuoteAtOrBefore(
      QUOTAS,
      new Date("2026-01-05T00:00:00.000Z"),
    );

    expect(PRICE?.value.toString()).toBe("110");
  });

  it("carries forward the last known price before a missing date", () => {
    const QUOTAS = [
      makeQuota(new Date("2026-01-03T00:00:00.000Z"), "100"),
      makeQuota(new Date("2026-01-05T00:00:00.000Z"), "110"),
    ];

    const PRICE = resolveQuoteAtOrBefore(
      QUOTAS,
      new Date("2026-01-06T00:00:00.000Z"),
    );

    expect(PRICE?.value.toString()).toBe("110");
  });

  it("returns null when no quote is at or before the date", () => {
    const QUOTAS = [makeQuota(new Date("2026-01-10T00:00:00.000Z"), "100")];

    const PRICE = resolveQuoteAtOrBefore(
      QUOTAS,
      new Date("2026-01-05T00:00:00.000Z"),
    );

    expect(PRICE).toBeNull();
  });

  it("returns the latest of multiple candidates", () => {
    const QUOTAS = [
      makeQuota(new Date("2026-01-03T00:00:00.000Z"), "100"),
      makeQuota(new Date("2026-01-04T00:00:00.000Z"), "105"),
      makeQuota(new Date("2026-01-05T00:00:00.000Z"), "110"),
    ];

    const PRICE = resolveQuoteAtOrBefore(
      QUOTAS,
      new Date("2026-01-05T00:00:00.000Z"),
    );

    expect(PRICE?.value.toString()).toBe("110");
  });
});

describe("snapshotDates", () => {
  it("returns distinct quote dates within range in ascending order", () => {
    const QUOTAS = [
      makeQuota(new Date("2026-01-03T00:00:00.000Z"), "100"),
      makeQuota(new Date("2026-01-05T00:00:00.000Z"), "110"),
      makeQuota(new Date("2026-01-05T00:00:00.000Z"), "115"),
    ];

    const DATES = snapshotDates(
      QUOTAS,
      new Date("2026-01-01T00:00:00.000Z"),
      new Date("2026-01-10T00:00:00.000Z"),
    );

    expect(DATES.map((D) => D.toISOString().slice(0, 10))).toEqual([
      "2026-01-03",
      "2026-01-05",
    ]);
  });
});
