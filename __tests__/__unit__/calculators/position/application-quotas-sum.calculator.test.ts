import { describe, expect, it } from "vitest";

import { calculateApplicationQuotasSum } from "@/business/calculators/position/application-quotas-sum.calculator";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("calculateApplicationQuotasSum", () => {
  it("returns the sum of multiple quota quantities", () => {
    const RESULT = calculateApplicationQuotasSum({
      quotaQuantity: [
        { value: QuotaQuantity.create("225825.442804") },
        { value: QuotaQuantity.create("100000.000000") },
      ],
    });

    expect(RESULT).toEqual(QuotaQuantity.create("325825.442804"));
  });

  it("returns zero when the quota quantity list is empty", () => {
    const RESULT = calculateApplicationQuotasSum({
      quotaQuantity: [],
    });

    expect(RESULT).toEqual(QuotaQuantity.create("0"));
  });

  it("returns the same quota quantity when only one value is provided", () => {
    const RESULT = calculateApplicationQuotasSum({
      quotaQuantity: [{ value: QuotaQuantity.create("225825.442804") }],
    });

    expect(RESULT).toEqual(QuotaQuantity.create("225825.442804"));
  });

  it("preserves precision when summing decimal quota quantities", () => {
    const RESULT = calculateApplicationQuotasSum({
      quotaQuantity: [
        { value: QuotaQuantity.create("0.333333") },
        { value: QuotaQuantity.create("0.333333") },
        { value: QuotaQuantity.create("0.333334") },
      ],
    });

    expect(RESULT).toEqual(QuotaQuantity.create("1"));
  });

  it("preserves precision with large quota quantities", () => {
    const RESULT = calculateApplicationQuotasSum({
      quotaQuantity: [
        { value: QuotaQuantity.create("999999999.999999") },
        { value: QuotaQuantity.create("0.000001") },
      ],
    });

    expect(RESULT).toEqual(QuotaQuantity.create("1000000000"));
  });

  it("does not mutate its inputs", () => {
    const QUOTA_QUANTITY = [
      { value: QuotaQuantity.create("225825.442804") },
      { value: QuotaQuantity.create("100000.000000") },
    ];

    calculateApplicationQuotasSum({
      quotaQuantity: QUOTA_QUANTITY,
    });

    expect(QUOTA_QUANTITY).toEqual([
      { value: QuotaQuantity.create("225825.442804") },
      { value: QuotaQuantity.create("100000.000000") },
    ]);
  });
});
