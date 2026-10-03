import { describe, it, expect } from "vitest"

import { toResponseDTO } from "@/services/quota/mappers/quota.mapper"
import {
  buildEntityId,
  buildQuota,
  buildQuotaPrice,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000024"

describe("services/quota/mappers/quota.mapper", () => {
  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a quota", () => {
      const quota = buildQuota({ id: buildEntityId(ID) })

      const response = toResponseDTO(quota)

      expect(response.id).toBe(ID)
    })

    it("should carry the fund id when serializing a quota", () => {
      const quota = buildQuota({
        fundId: buildEntityId("fund-55"),
      })

      const response = toResponseDTO(quota)

      expect(response.fundId).toBe("fund-55")
    })

    it("should expose the quote date as an ISO 8601 string when serializing a quota", () => {
      const quota = buildQuota({
        date: new Date("2026-01-15T00:00:00.000Z"),
      })

      const response = toResponseDTO(quota)

      expect(response.date).toBe("2026-01-15T00:00:00.000Z")
    })

    it("should expose the price as a decimal string when serializing a quota", () => {
      const quota = buildQuota({
        price: buildQuotaPrice("12.75"),
      })

      const response = toResponseDTO(quota)

      expect(response.price).toBe("12.75")
    })

    it("should keep the price decimal places when serializing a quota", () => {
      const quota = buildQuota({
        price: buildQuotaPrice("10.123456"),
      })

      const response = toResponseDTO(quota)

      expect(response.price).toBe("10.123456")
    })

    it("should expose a zero price as a decimal string when serializing a quota", () => {
      const quota = buildQuota({
        price: buildQuotaPrice("0"),
      })

      const response = toResponseDTO(quota)

      expect(response.price).toBe("0")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a quota", () => {
      const quota = buildQuota({
        createdAt: new Date("2026-01-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(quota)

      expect(response.createdAt).toBe("2026-01-15T12:00:00.000Z")
    })
  })
})
