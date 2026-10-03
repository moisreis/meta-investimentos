import { describe, it, expect } from "vitest"

import { toResponseDTO } from "@/services/portfolio-performance/mappers/portfolio-performance.mapper"
import {
  buildEntityId,
  buildPortfolioPerformance,
  buildPositiveMoney,
  buildQuotaQuantity,
  buildSignedMoney,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000021"

describe("services/portfolio-performance/mappers/portfolio-performance.mapper", () => {
  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(performance)

      expect(response.id).toBe(ID)
    })

    it("should carry the portfolio id when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        portfolioId: buildEntityId("portfolio-77"),
      })

      const response = toResponseDTO(performance)

      expect(response.portfolioId).toBe("portfolio-77")
    })

    it("should expose the snapshot date as an ISO 8601 string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        date: new Date("2026-03-31T00:00:00.000Z"),
      })

      const response = toResponseDTO(performance)

      expect(response.date).toBe("2026-03-31T00:00:00.000Z")
    })

    it("should expose the held quotas as a decimal string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        quotasHeld: buildQuotaQuantity("1234.567891"),
      })

      const response = toResponseDTO(performance)

      expect(response.quotasHeld).toBe("1234.567891")
    })

    it("should expose the patrimony as a decimal string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        patrimony: buildPositiveMoney("75000.25"),
      })

      const response = toResponseDTO(performance)

      expect(response.patrimony).toBe("75000.25")
    })

    it("should expose the application and redemption totals as decimal strings when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        applicationTotal: buildPositiveMoney("12000.10"),
        redemptionTotal: buildPositiveMoney("4500.99"),
      })

      const response = toResponseDTO(performance)

      expect(response.applicationTotal).toBe("12000.1")
      expect(response.redemptionTotal).toBe("4500.99")
    })

    it("should expose the signed cash flow and earnings as decimal strings when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        cashFlowNet: buildSignedMoney("-2500.25"),
        earnings: buildSignedMoney("1750.5"),
      })

      const response = toResponseDTO(performance)

      expect(response.cashFlowNet).toBe("-2500.25")
      expect(response.earnings).toBe("1750.5")
    })

    it("should expose the daily return as a decimal string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        returnDaily: buildSignedPercentage("0.75"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnDaily).toBe("0.75")
    })

    it("should expose a null monthly return when the snapshot has no monthly return", () => {
      const performance = buildPortfolioPerformance({
        returnMonthly: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBeNull()
    })

    it("should expose the monthly return as a decimal string when the snapshot has a monthly return", () => {
      const performance = buildPortfolioPerformance({
        returnMonthly: buildSignedPercentage("1.25"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBe("1.25")
    })

    it("should expose a null yearly return when the snapshot has no yearly return", () => {
      const performance = buildPortfolioPerformance({
        returnYearly: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnYearly).toBeNull()
    })

    it("should expose the yearly return as a decimal string when the snapshot has a yearly return", () => {
      const performance = buildPortfolioPerformance({
        returnYearly: buildSignedPercentage("12.4"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnYearly).toBe("12.4")
    })

    it("should expose a null last twelve months return when the snapshot has no such return", () => {
      const performance = buildPortfolioPerformance({
        returnLast12m: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnLast12m).toBeNull()
    })

    it("should expose the last twelve months return as a decimal string when the snapshot has such a return", () => {
      const performance = buildPortfolioPerformance({
        returnLast12m: buildSignedPercentage("-3.6"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnLast12m).toBe("-3.6")
    })

    it("should expose a null target when the snapshot has no target", () => {
      const performance = buildPortfolioPerformance({
        target: null,
      })

      const response = toResponseDTO(performance)

      expect(response.target).toBeNull()
    })

    it("should expose the target as a decimal string when the snapshot has a target", () => {
      const performance = buildPortfolioPerformance({
        target: buildSignedPercentage("11"),
      })

      const response = toResponseDTO(performance)

      expect(response.target).toBe("11")
    })

    it("should expose a null cumulative target when the snapshot has no cumulative target", () => {
      const performance = buildPortfolioPerformance({
        cumulativeTarget: null,
      })

      const response = toResponseDTO(performance)

      expect(response.cumulativeTarget).toBeNull()
    })

    it("should expose the cumulative target as a decimal string when the snapshot has a cumulative target", () => {
      const performance = buildPortfolioPerformance({
        cumulativeTarget: buildSignedPercentage("9.5"),
      })

      const response = toResponseDTO(performance)

      expect(response.cumulativeTarget).toBe("9.5")
    })

    it("should expose a null inflation spread when the snapshot has no inflation spread", () => {
      const performance = buildPortfolioPerformance({
        inflationSpread: null,
      })

      const response = toResponseDTO(performance)

      expect(response.inflationSpread).toBeNull()
    })

    it("should expose the inflation spread as a decimal string when the snapshot has an inflation spread", () => {
      const performance = buildPortfolioPerformance({
        inflationSpread: buildSignedPercentage("5.25"),
      })

      const response = toResponseDTO(performance)

      expect(response.inflationSpread).toBe("5.25")
    })

    it("should expose a null risk free spread when the snapshot has no risk free spread", () => {
      const performance = buildPortfolioPerformance({
        riskFreeSpread: null,
      })

      const response = toResponseDTO(performance)

      expect(response.riskFreeSpread).toBeNull()
    })

    it("should expose the risk free spread as a decimal string when the snapshot has a risk free spread", () => {
      const performance = buildPortfolioPerformance({
        riskFreeSpread: buildSignedPercentage("7.75"),
      })

      const response = toResponseDTO(performance)

      expect(response.riskFreeSpread).toBe("7.75")
    })

    it("should expose a null market spread when the snapshot has no market spread", () => {
      const performance = buildPortfolioPerformance({
        marketSpread: null,
      })

      const response = toResponseDTO(performance)

      expect(response.marketSpread).toBeNull()
    })

    it("should expose the market spread as a decimal string when the snapshot has a market spread", () => {
      const performance = buildPortfolioPerformance({
        marketSpread: buildSignedPercentage("-2.15"),
      })

      const response = toResponseDTO(performance)

      expect(response.marketSpread).toBe("-2.15")
    })

    it("should expose every optional field as null when the snapshot omits them", () => {
      const performance = buildPortfolioPerformance({
        returnMonthly: null,
        returnYearly: null,
        returnLast12m: null,
        target: null,
        cumulativeTarget: null,
        inflationSpread: null,
        riskFreeSpread: null,
        marketSpread: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBeNull()
      expect(response.returnYearly).toBeNull()
      expect(response.returnLast12m).toBeNull()
      expect(response.target).toBeNull()
      expect(response.cumulativeTarget).toBeNull()
      expect(response.inflationSpread).toBeNull()
      expect(response.riskFreeSpread).toBeNull()
      expect(response.marketSpread).toBeNull()
    })

    it("should expose every optional field as a decimal string when the snapshot carries them", () => {
      const performance = buildPortfolioPerformance({
        returnMonthly: buildSignedPercentage("1"),
        returnYearly: buildSignedPercentage("2"),
        returnLast12m: buildSignedPercentage("3"),
        target: buildSignedPercentage("4"),
        cumulativeTarget: buildSignedPercentage("5"),
        inflationSpread: buildSignedPercentage("6"),
        riskFreeSpread: buildSignedPercentage("7"),
        marketSpread: buildSignedPercentage("8"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBe("1")
      expect(response.returnYearly).toBe("2")
      expect(response.returnLast12m).toBe("3")
      expect(response.target).toBe("4")
      expect(response.cumulativeTarget).toBe("5")
      expect(response.inflationSpread).toBe("6")
      expect(response.riskFreeSpread).toBe("7")
      expect(response.marketSpread).toBe("8")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a portfolio performance", () => {
      const performance = buildPortfolioPerformance({
        createdAt: new Date("2026-04-01T08:15:00.000Z"),
      })

      const response = toResponseDTO(performance)

      expect(response.createdAt).toBe("2026-04-01T08:15:00.000Z")
    })
  })
})
