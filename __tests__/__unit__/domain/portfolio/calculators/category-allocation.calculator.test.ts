import { describe, it, expect } from "vitest"
import { calculatePortfolioCategoryAllocation } from "@/domain/portfolio/calculators/category-allocation.calculator"

describe("domain/portfolio/calculators/category-allocation.calculator", () => {
  describe("calculatePortfolioCategoryAllocation", () => {
    it("should return an empty list when there are no entries", () => {
      const rows = calculatePortfolioCategoryAllocation([])

      expect(rows).toEqual([])
    })

    it("should group entries of the same category and sort groups by value", () => {
      const rows = calculatePortfolioCategoryAllocation([
        {
          categoryName: "Renda Fixa",
          investedValue: "800.00",
        },
        {
          categoryName: "Renda Variável",
          investedValue: "200.00",
        },
        {
          categoryName: "Renda Fixa",
          investedValue: "150.00",
        },
      ])

      expect(rows).toEqual([
        {
          categoryName: "Renda Fixa",
          investedValue: "950.00",
          weight: "82.61",
        },
        {
          categoryName: "Renda Variável",
          investedValue: "200.00",
          weight: "17.39",
        },
      ])
    })

    it("should preserve null categories as their own group", () => {
      const rows = calculatePortfolioCategoryAllocation([
        {
          categoryName: null,
          investedValue: "300.00",
        },
        {
          categoryName: "Renda Fixa",
          investedValue: "700.00",
        },
      ])

      expect(rows).toEqual([
        {
          categoryName: "Renda Fixa",
          investedValue: "700.00",
          weight: "70.00",
        },
        {
          categoryName: null,
          investedValue: "300.00",
          weight: "30.00",
        },
      ])
    })

    it("should weight every row at 0.00 when the total is zero", () => {
      const rows = calculatePortfolioCategoryAllocation([
        { categoryName: "A", investedValue: "0.00" },
        { categoryName: "B", investedValue: "0.00" },
      ])

      expect(rows.every((row) => row.weight === "0.00")).toBe(
        true
      )
    })

    it("should accept negative invested values", () => {
      const rows = calculatePortfolioCategoryAllocation([
        {
          categoryName: "A",
          investedValue: "-100.00",
        },
        {
          categoryName: "B",
          investedValue: "400.00",
        },
      ])

      expect(rows).toEqual([
        {
          categoryName: "B",
          investedValue: "400.00",
          weight: "133.33",
        },
        {
          categoryName: "A",
          investedValue: "-100.00",
          weight: "-33.33",
        },
      ])
    })
  })
})
