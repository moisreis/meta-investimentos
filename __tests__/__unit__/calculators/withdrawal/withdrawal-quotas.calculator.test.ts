import { describe, expect, it } from "vitest";

import { calculateWithdrawalQuotas } from "@/business/calculators/withdrawal/withdrawal-quotas.calculator";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

describe("calculateWithdrawalQuotas", () => {
  it("returns the proved value for the `CAIXA BRASIL IRF-M 1 TÃTULOS PÃšBLICOS FI RENDA FIXA` at 19/5/2026", () => {
    const RESULT = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(1000000),
      quota: QuotaPrice.create(4.450869),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("224675.226343"));
  });

  it("rounds the result to 6 decimal places", () => {
    const RESULT = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(1),
      quota: QuotaPrice.create(3),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("0.333333"));
  });

  it("returns an exact quotient when division is exact", () => {
    const RESULT = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(100),
      quota: QuotaPrice.create(4),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("25"));
  });

  it("rounds a very small quotient down to zero when below 6 decimal places", () => {
    const RESULT = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(0.0000001),
      quota: QuotaPrice.create(1),
    });
    expect(RESULT).toEqual(QuotaQuantity.create("0"));
  });

  it("preserves precision with large withdrawal values", () => {
    const RESULT = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(999999999.999999),
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
      calculateWithdrawalQuotas({
        withdrawal: PositiveMoney.create(1000000),
        quota: QuotaPrice.create(0),
      }),
    ).toThrow(
      "Withdrawal quotas cannot be calculated with a zero quota price.",
    );
  });

  it("does not mutate its inputs", () => {
    const WITHDRAWAL = PositiveMoney.create(1000000);
    const QUOTA = QuotaPrice.create(4.428199);

    calculateWithdrawalQuotas({ withdrawal: WITHDRAWAL, quota: QUOTA });

    expect(WITHDRAWAL.value.toString()).toBe("1000000");
    expect(QUOTA.value.toString()).toBe("4.428199");
  });
});
