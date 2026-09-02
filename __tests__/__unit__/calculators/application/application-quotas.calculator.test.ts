import { describe, expect, it } from "vitest";

import { calculateApplicationQuotas } from "@/business/calculators/application/application-quotas.calculator";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

describe("calculateApplicationQuotas", () => {
  it("returns the proved value for the `CAIXA BRASIL IRF-M 1 TÃTULOS PÃšBLICOS FI RENDA FIXA` at 5/5/2026", () => {
    const RESULT = calculateApplicationQuotas({
      application: PositiveMoney.create(1000000),
      quota: QuotaPrice.create(4.428199),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("225825.442804"));
  });

  it("rounds the result to 6 decimal places", () => {
    const RESULT = calculateApplicationQuotas({
      application: PositiveMoney.create(1),
      quota: QuotaPrice.create(3),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("0.333333"));
  });

  it("returns an exact quotient when division is exact", () => {
    const RESULT = calculateApplicationQuotas({
      application: PositiveMoney.create(100),
      quota: QuotaPrice.create(4),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("25"));
  });

  it("rounds a very small quotient down to zero when below 6 decimal places", () => {
    const RESULT = calculateApplicationQuotas({
      application: PositiveMoney.create(0.0000001),
      quota: QuotaPrice.create(1),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("0"));
  });

  it("preserves precision with large application values", () => {
    const RESULT = calculateApplicationQuotas({
      application: PositiveMoney.create(999999999.999999),
      quota: QuotaPrice.create(1.000001),
    });
    expect(RESULT).toEqual(
      QuotaQuantity.create(
        PositiveMoney.create(999999999.999999).value.dividedBy(
          QuotaPrice.create(1.000001).value,
        ),
      ),
    );
  });

  it("throws when the quota price is zero", () => {
    expect(() =>
      calculateApplicationQuotas({
        application: PositiveMoney.create(1000000),
        quota: QuotaPrice.create(0),
      }),
    ).toThrow(
      "Application quotas cannot be calculated with a zero quota price.",
    );
  });

  it("does not mutate its inputs", () => {
    const APPLICATION = PositiveMoney.create(1000000);
    const QUOTA = QuotaPrice.create(4.428199);

    calculateApplicationQuotas({ application: APPLICATION, quota: QUOTA });

    expect(APPLICATION.value.toString()).toBe("1000000");
    expect(QUOTA.value.toString()).toBe("4.428199");
  });
});
