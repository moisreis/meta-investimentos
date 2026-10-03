import { describe, it, expect } from "vitest"

import { Position } from "@/domain/position/entities/position.entity"
import {
  toCreatePositionProps,
  toResponseDTO,
} from "@/services/position/mappers/position.mapper"
import {
  buildEntityId,
  buildPositiveMoney,
  buildPosition,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000022"

describe("services/position/mappers/position.mapper", () => {
  describe("toCreatePositionProps", () => {
    it("should convert the portfolio id into an EntityId when mapping a create DTO", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
      })

      expect(props.portfolioId).toBe("portfolio-1")
    })

    it("should convert the fund id into an EntityId when mapping a create DTO", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
      })

      expect(props.fundId).toBe("fund-1")
    })

    it("should parse the initial balance into a PositiveMoney when the create DTO carries it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalance: "15000.75",
      })

      expect(props.initialBalance?.value.toString()).toBe(
        "15000.75"
      )
    })

    it("should fall back to a null initial balance when the create DTO omits it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
      })

      expect(props.initialBalance).toBeNull()
    })

    it("should fall back to a null initial balance when the create DTO sends it as null", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalance: null,
      })

      expect(props.initialBalance).toBeNull()
    })

    it("should parse the initial balance date into a Date when the create DTO carries it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalanceDate: "2026-01-15T00:00:00.000Z",
      })

      expect(props.initialBalanceDate).toBeInstanceOf(Date)
      expect(props.initialBalanceDate?.toISOString()).toBe(
        "2026-01-15T00:00:00.000Z"
      )
    })

    it("should parse a date-only initial balance date into midnight UTC when the create DTO carries it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalanceDate: "2026-01-15",
      })

      expect(props.initialBalanceDate?.toISOString()).toBe(
        "2026-01-15T00:00:00.000Z"
      )
    })

    it("should fall back to a null initial balance date when the create DTO omits it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
      })

      expect(props.initialBalanceDate).toBeNull()
    })

    it("should fall back to a null initial balance date when the create DTO sends it as null", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalanceDate: null,
      })

      expect(props.initialBalanceDate).toBeNull()
    })

    it("should parse the allocation into a SignedPercentage when the create DTO carries it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        allocation: "45.5",
      })

      expect(props.allocation?.value.toString()).toBe("45.5")
    })

    it("should default the allocation to the full share of the portfolio when the create DTO omits it", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
      })

      expect(props.allocation?.value.toString()).toBe("100")
    })

    it("should produce props accepted by Position.create when mapping a create DTO", () => {
      const props = toCreatePositionProps({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        initialBalance: "15000.75",
        initialBalanceDate: "2026-01-15T00:00:00.000Z",
        allocation: "45.5",
      })

      expect(() => Position.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a position", () => {
      const position = buildPosition({ id: buildEntityId(ID) })

      const response = toResponseDTO(position)

      expect(response.id).toBe(ID)
    })

    it("should carry the portfolio and fund ids when serializing a position", () => {
      const position = buildPosition({
        portfolioId: buildEntityId("portfolio-88"),
        fundId: buildEntityId("fund-99"),
      })

      const response = toResponseDTO(position)

      expect(response.portfolioId).toBe("portfolio-88")
      expect(response.fundId).toBe("fund-99")
    })

    it("should expose the initial balance as a decimal string when the position has one", () => {
      const position = buildPosition({
        initialBalance: buildPositiveMoney("15000.75"),
      })

      const response = toResponseDTO(position)

      expect(response.initialBalance).toBe("15000.75")
    })

    it("should expose a null initial balance when the position has none", () => {
      const position = buildPosition({ initialBalance: null })

      const response = toResponseDTO(position)

      expect(response.initialBalance).toBeNull()
    })

    it("should expose the initial balance date as an ISO 8601 string when the position has one", () => {
      const position = buildPosition({
        initialBalanceDate: new Date("2026-01-15T10:30:00.000Z"),
      })

      const response = toResponseDTO(position)

      expect(response.initialBalanceDate).toBe(
        "2026-01-15T10:30:00.000Z"
      )
    })

    it("should expose a null initial balance date when the position has none", () => {
      const position = buildPosition({
        initialBalanceDate: null,
      })

      const response = toResponseDTO(position)

      expect(response.initialBalanceDate).toBeNull()
    })

    it("should expose the allocation as a decimal string when serializing a position", () => {
      const position = buildPosition({
        allocation: buildSignedPercentage("45.5"),
      })

      const response = toResponseDTO(position)

      expect(response.allocation).toBe("45.5")
    })

    it("should carry the optimistic lock version when serializing a position", () => {
      const position = buildPosition({ version: 7 })

      const response = toResponseDTO(position)

      expect(response.version).toBe(7)
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a position", () => {
      const position = buildPosition({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(position)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
