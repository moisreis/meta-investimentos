import { describe, it, expect } from "vitest"

import { NormsPortfolios } from "@/domain/norms-portfolio/entities/norms-portfolios.entity"
import {
  toCreateNormsPortfoliosProps,
  toResponseDTO,
} from "@/services/norms-portfolio/mappers/norms-portfolio.mapper"
import {
  buildEntityId,
  buildNormsPortfolios,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000006"

describe("services/norms-portfolio/mappers/norms-portfolio.mapper", () => {
  describe("toCreateNormsPortfoliosProps", () => {
    it("should convert the norm id into an EntityId when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "  norm-13  ",
        portfolioId: "portfolio-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.normId).toBe("norm-13")
    })

    it("should convert the portfolio id into an EntityId when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "norm-1",
        portfolioId: "  portfolio-27  ",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.portfolioId).toBe("portfolio-27")
    })

    it("should convert the minimum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "norm-1",
        portfolioId: "portfolio-1",
        minAllocation: "7.25",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.minAllocation.value.toString()).toBe("7.25")
      expect(props.minAllocation.value.toFixed(2)).toBe("7.25")
    })

    it("should convert the maximum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "norm-1",
        portfolioId: "portfolio-1",
        minAllocation: "5",
        maxAllocation: "33.75",
        targetAllocation: "12",
      })

      expect(props.maxAllocation.value.toString()).toBe("33.75")
      expect(props.maxAllocation.value.toFixed(2)).toBe("33.75")
    })

    it("should convert the target allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "norm-1",
        portfolioId: "portfolio-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "18.50",
      })

      expect(props.targetAllocation.value.toString()).toBe(
        "18.5"
      )
      expect(props.targetAllocation.value.toFixed(2)).toBe(
        "18.50"
      )
    })

    it("should produce props accepted by NormsPortfolios.create when mapping a create DTO", () => {
      const props = toCreateNormsPortfoliosProps({
        normId: "norm-5",
        portfolioId: "portfolio-6",
        minAllocation: "10",
        maxAllocation: "60",
        targetAllocation: "35",
      })

      expect(() => NormsPortfolios.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(relation)

      expect(response.id).toBe(ID)
    })

    it("should carry the norm id when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        normId: buildEntityId("norm-31"),
      })

      const response = toResponseDTO(relation)

      expect(response.normId).toBe("norm-31")
    })

    it("should carry the portfolio id when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        portfolioId: buildEntityId("portfolio-44"),
      })

      const response = toResponseDTO(relation)

      expect(response.portfolioId).toBe("portfolio-44")
    })

    it("should carry the minimum allocation as a decimal string when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        minAllocation: buildSignedPercentage("7.25"),
      })

      const response = toResponseDTO(relation)

      expect(response.minAllocation).toBe("7.25")
    })

    it("should carry the maximum allocation as a decimal string when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        maxAllocation: buildSignedPercentage("33.75"),
      })

      const response = toResponseDTO(relation)

      expect(response.maxAllocation).toBe("33.75")
    })

    it("should carry the target allocation as a decimal string when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        targetAllocation: buildSignedPercentage("18.50"),
      })

      const response = toResponseDTO(relation)

      expect(response.targetAllocation).toBe("18.5")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        createdAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(relation)

      expect(response.createdAt).toBe("2026-02-15T12:00:00.000Z")
    })

    it("should not expose an update timestamp when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        createdAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(relation)

      expect(Object.keys(response)).toStrictEqual([
        "id",
        "normId",
        "portfolioId",
        "minAllocation",
        "maxAllocation",
        "targetAllocation",
        "createdAt",
      ])
    })

    it("should expose every field when serializing a norm-portfolio relation", () => {
      const relation = buildNormsPortfolios({
        normId: buildEntityId("norm-1"),
        portfolioId: buildEntityId("portfolio-1"),
        minAllocation: buildSignedPercentage("7.50"),
        maxAllocation: buildSignedPercentage("33.00"),
        targetAllocation: buildSignedPercentage("18.00"),
        createdAt: new Date("2026-06-01T00:00:00.000Z"),
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(relation)

      expect(response).toStrictEqual({
        id: ID,
        normId: "norm-1",
        portfolioId: "portfolio-1",
        minAllocation: "7.5",
        maxAllocation: "33",
        targetAllocation: "18",
        createdAt: "2026-06-01T00:00:00.000Z",
      })
    })
  })
})
