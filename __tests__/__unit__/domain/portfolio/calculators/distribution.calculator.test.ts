import { describe, it, expect } from "vitest"
import { calculateDistribution } from "@/domain/portfolio/calculators/distribution.calculator"

describe("domain/portfolio/calculators/distribution.calculator", () => {
  describe("calculateDistribution", () => {
    it("should return an empty list when there are no entries", () => {
      expect(calculateDistribution([])).toEqual([])
    })

    it("should group entries by label and sort largest first", () => {
      const rows = calculateDistribution([
        { label: "Fundo B", value: "200.00" },
        { label: "Fundo A", value: "700.00" },
        { label: "Fundo A", value: "100.00" },
      ])

      expect(rows).toEqual([
        { label: "Fundo A", value: "800.00", weight: "80.00" },
        { label: "Fundo B", value: "200.00", weight: "20.00" },
      ])
    })

    it("should weight every row at 0.00 when the total is zero", () => {
      const rows = calculateDistribution([
        { label: "A", value: "0.00" },
        { label: "B", value: "0.00" },
      ])

      expect(rows.every((row) => row.weight === "0.00")).toBe(
        true
      )
    })
  })
})
