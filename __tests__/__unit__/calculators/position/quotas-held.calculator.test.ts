import { describe, expect, it } from "vitest";

import { calculateQuotasHeld } from "@/business/calculators/position/quotas-held.calculator";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("calculateQuotasHeld", () => {
  it("returns the proved value for the position at the end of the period for `CAIXA BRASIL IRF-M 1 TÍTULOS PÚBLICOS FI RENDA FIXA`", () => {
    const RESULT = calculateQuotasHeld({
      lastPeriodQuotaQuantity: QuotaQuantity.create("342021.111191"),
      applicationQuotasQuantity: QuotaQuantity.create("225825.442804"),
      withdrawalQuotasQuantity: QuotaQuantity.create("224675.226343"),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("343171.327652"));
  });

  it("returns the previous period quota quantity when applications and withdrawals are zero", () => {
    const RESULT = calculateQuotasHeld({
      lastPeriodQuotaQuantity: QuotaQuantity.create("100000"),
      applicationQuotasQuantity: QuotaQuantity.create("0"),
      withdrawalQuotasQuantity: QuotaQuantity.create("0"),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("100000"));
  });

  it("increases the held quotas when applications exceed withdrawals", () => {
    const RESULT = calculateQuotasHeld({
      lastPeriodQuotaQuantity: QuotaQuantity.create("100000"),
      applicationQuotasQuantity: QuotaQuantity.create("25000"),
      withdrawalQuotasQuantity: QuotaQuantity.create("10000"),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("115000"));
  });

  it("decreases the held quotas when withdrawals exceed applications", () => {
    const RESULT = calculateQuotasHeld({
      lastPeriodQuotaQuantity: QuotaQuantity.create("100000"),
      applicationQuotasQuantity: QuotaQuantity.create("10000"),
      withdrawalQuotasQuantity: QuotaQuantity.create("25000"),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("85000"));
  });

  it("preserves precision with decimal quota quantities", () => {
    const RESULT = calculateQuotasHeld({
      lastPeriodQuotaQuantity: QuotaQuantity.create("100.333333"),
      applicationQuotasQuantity: QuotaQuantity.create("50.222222"),
      withdrawalQuotasQuantity: QuotaQuantity.create("25.111111"),
    });

    expect(RESULT).toEqual(QuotaQuantity.create("125.444444"));
  });

  it("does not mutate its inputs", () => {
    const LAST_PERIOD_QUOTA_QUANTITY = QuotaQuantity.create("342021.111191");
    const APPLICATION_QUOTAS_QUANTITY = QuotaQuantity.create("225825.442804");
    const WITHDRAWAL_QUOTAS_QUANTITY = QuotaQuantity.create("224675.226343");

    calculateQuotasHeld({
      lastPeriodQuotaQuantity: LAST_PERIOD_QUOTA_QUANTITY,
      applicationQuotasQuantity: APPLICATION_QUOTAS_QUANTITY,
      withdrawalQuotasQuantity: WITHDRAWAL_QUOTAS_QUANTITY,
    });

    expect(LAST_PERIOD_QUOTA_QUANTITY).toEqual(
      QuotaQuantity.create("342021.111191"),
    );
    expect(APPLICATION_QUOTAS_QUANTITY).toEqual(
      QuotaQuantity.create("225825.442804"),
    );
    expect(WITHDRAWAL_QUOTAS_QUANTITY).toEqual(
      QuotaQuantity.create("224675.226343"),
    );
  });
});
