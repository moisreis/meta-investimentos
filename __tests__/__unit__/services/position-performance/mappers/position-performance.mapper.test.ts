import { describe, it, expect } from "vitest"

import { toResponseDTO } from "@/services/position-performance/mappers/position-performance.mapper"
import {
  buildEntityId,
  buildPositiveMoney,
  buildPositionPerformance,
  buildQuotaQuantity,
  buildSignedMoney,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000023"

describe("services/position-performance/mappers/position-performance.mapper", () => {
  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(performance)

      expect(response.id).toBe(ID)
    })

    it("should carry the position id when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        positionId: buildEntityId("position-33"),
      })

      const response = toResponseDTO(performance)

      expect(response.positionId).toBe("position-33")
    })

    it("should expose the snapshot date as an ISO 8601 string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        date: new Date("2026-03-31T00:00:00.000Z"),
      })

      const response = toResponseDTO(performance)

      expect(response.date).toBe("2026-03-31T00:00:00.000Z")
    })

    it("should expose the held quotas as a decimal string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        quotasHeld: buildQuotaQuantity("1234.567891"),
      })

      const response = toResponseDTO(performance)

      expect(response.quotasHeld).toBe("1234.567891")
    })

    it("should expose the patrimony as a decimal string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        patrimony: buildPositiveMoney("75000.25"),
      })

      const response = toResponseDTO(performance)

      expect(response.patrimony).toBe("75000.25")
    })

    it("should expose the application and redemption totals as decimal strings when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        applicationTotal: buildPositiveMoney("12000.10"),
        redemptionTotal: buildPositiveMoney("4500.99"),
      })

      const response = toResponseDTO(performance)

      expect(response.applicationTotal).toBe("12000.1")
      expect(response.redemptionTotal).toBe("4500.99")
    })

    it("should expose the signed cash flow and earnings as decimal strings when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        cashFlowNet: buildSignedMoney("-2500.25"),
        earnings: buildSignedMoney("1750.5"),
      })

      const response = toResponseDTO(performance)

      expect(response.cashFlowNet).toBe("-2500.25")
      expect(response.earnings).toBe("1750.5")
    })

    it("should expose the daily return as a decimal string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        returnDaily: buildSignedPercentage("0.75"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnDaily).toBe("0.75")
    })

    it("should expose a null monthly return when the snapshot has no monthly return", () => {
      const performance = buildPositionPerformance({
        returnMonthly: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBeNull()
    })

    it("should expose the monthly return as a decimal string when the snapshot has a monthly return", () => {
      const performance = buildPositionPerformance({
        returnMonthly: buildSignedPercentage("1.25"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBe("1.25")
    })

    it("should expose a null yearly return when the snapshot has no yearly return", () => {
      const performance = buildPositionPerformance({
        returnYearly: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnYearly).toBeNull()
    })

    it("should expose the yearly return as a decimal string when the snapshot has a yearly return", () => {
      const performance = buildPositionPerformance({
        returnYearly: buildSignedPercentage("12.4"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnYearly).toBe("12.4")
    })

    it("should expose a null last twelve months return when the snapshot has no such return", () => {
      const performance = buildPositionPerformance({
        returnLast12m: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnLast12m).toBeNull()
    })

    it("should expose the last twelve months return as a decimal string when the snapshot has such a return", () => {
      const performance = buildPositionPerformance({
        returnLast12m: buildSignedPercentage("-3.6"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnLast12m).toBe("-3.6")
    })

    it("should expose every optional field as null when the snapshot omits them", () => {
      const performance = buildPositionPerformance({
        returnMonthly: null,
        returnYearly: null,
        returnLast12m: null,
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBeNull()
      expect(response.returnYearly).toBeNull()
      expect(response.returnLast12m).toBeNull()
    })

    it("should expose every optional field as a decimal string when the snapshot carries them", () => {
      const performance = buildPositionPerformance({
        returnMonthly: buildSignedPercentage("1"),
        returnYearly: buildSignedPercentage("2"),
        returnLast12m: buildSignedPercentage("3"),
      })

      const response = toResponseDTO(performance)

      expect(response.returnMonthly).toBe("1")
      expect(response.returnYearly).toBe("2")
      expect(response.returnLast12m).toBe("3")
    })

    it("should expose the allocation as a decimal string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        allocation: buildSignedPercentage("45.5"),
      })

      const response = toResponseDTO(performance)

      expect(response.allocation).toBe("45.5")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a position performance", () => {
      const performance = buildPositionPerformance({
        createdAt: new Date("2026-04-01T08:15:00.000Z"),
      })

      const response = toResponseDTO(performance)

      expect(response.createdAt).toBe("2026-04-01T08:15:00.000Z")
    })
  })
})
