import { describe, it, expect } from "vitest"

import { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import {
  toCreatePortfolioProps,
  toResponseDTO,
} from "@/services/portfolio/mappers/portfolio.mapper"
import {
  buildEntityId,
  buildPortfolio,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000020"

describe("services/portfolio/mappers/portfolio.mapper", () => {
  describe("toCreatePortfolioProps", () => {
    it("should carry the acronym and name of the payload when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.acronym).toBe("MASTER")
      expect(props.name).toBe("Master Portfolio")
    })

    it("should convert the user id into an EntityId when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.userId).toBe("user-7")
    })

    it("should parse the annual interest rate into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.annualInterestRate.value.toString()).toBe(
        "10.5"
      )
    })

    it("should parse the minimum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "3.75",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.minAllocation.value.toString()).toBe("3.75")
    })

    it("should parse the maximum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "42",
        targetAllocation: "12",
      })

      expect(props.maxAllocation.value.toString()).toBe("42")
    })

    it("should parse the target allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12.5",
      })

      expect(props.targetAllocation.value.toString()).toBe(
        "12.5"
      )
    })

    it("should produce props accepted by Portfolio.create when mapping a create DTO", () => {
      const props = toCreatePortfolioProps({
        acronym: "MASTER",
        name: "Master Portfolio",
        userId: "user-7",
        annualInterestRate: "10.5",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(() => Portfolio.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a portfolio", () => {
      const portfolio = buildPortfolio({ id: buildEntityId(ID) })

      const response = toResponseDTO(portfolio)

      expect(response.id).toBe(ID)
    })

    it("should carry the acronym and name when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        acronym: "RF",
        name: "Renda Fixa IPCA",
      })

      const response = toResponseDTO(portfolio)

      expect(response.acronym).toBe("RF")
      expect(response.name).toBe("Renda Fixa IPCA")
    })

    it("should carry the owner id when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        userId: buildEntityId("user-42"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.userId).toBe("user-42")
    })

    it("should expose the annual interest rate as a decimal string when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        annualInterestRate: buildSignedPercentage("10.5"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.annualInterestRate).toBe("10.5")
    })

    it("should expose the minimum allocation as a decimal string when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        minAllocation: buildSignedPercentage("3.75"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.minAllocation).toBe("3.75")
    })

    it("should expose the maximum allocation as a decimal string when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        maxAllocation: buildSignedPercentage("42"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.maxAllocation).toBe("42")
    })

    it("should expose the target allocation as a decimal string when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        targetAllocation: buildSignedPercentage("12.5"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.targetAllocation).toBe("12.5")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a portfolio", () => {
      const portfolio = buildPortfolio({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(portfolio)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
