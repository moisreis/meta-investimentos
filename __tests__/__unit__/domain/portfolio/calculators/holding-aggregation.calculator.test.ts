import { describe, it, expect } from "vitest"
import { calculateHoldingAggregation } from "@/domain/portfolio/calculators/holding-aggregation.calculator"

describe("domain/portfolio/calculators/holding-aggregation.calculator", () => {
  describe("calculateHoldingAggregation", () => {
    it("should return an empty list when there is nothing to aggregate", () => {
      const result = calculateHoldingAggregation([])

      expect(result).toEqual([])
    })

    it("should sum the patrimony and the earnings of the same label", () => {
      const result = calculateHoldingAggregation([
        { label: "CDI", patrimony: "400.00", earnings: "4.00" },
        { label: "CDI", patrimony: "200.00", earnings: "2.00" },
      ])

      expect(result).toEqual([
        {
          label: "CDI",
          patrimony: "600.00",
          earnings: "6.00",
          weight: "100.00",
        },
      ])
    })

    it("should sort the groups by patrimony, largest first", () => {
      const result = calculateHoldingAggregation([
        { label: "IPCA", patrimony: "200.00", earnings: "1.00" },
        { label: "CDI", patrimony: "800.00", earnings: "8.00" },
      ])

      expect(result.map((row) => row.label)).toEqual([
        "CDI",
        "IPCA",
      ])
    })

    it("should derive the weight of each group over the total", () => {
      const result = calculateHoldingAggregation([
        { label: "CDI", patrimony: "800.00", earnings: "8.00" },
        { label: "IPCA", patrimony: "200.00", earnings: "1.00" },
      ])

      expect(result).toEqual([
        {
          label: "CDI",
          patrimony: "800.00",
          earnings: "8.00",
          weight: "80.00",
        },
        {
          label: "IPCA",
          patrimony: "200.00",
          earnings: "1.00",
          weight: "20.00",
        },
      ])
    })

    it("should weigh every group as zero when the total patrimony is zero", () => {
      const result = calculateHoldingAggregation([
        { label: "CDI", patrimony: "0.00", earnings: "0.00" },
        { label: "IPCA", patrimony: "0.00", earnings: "0.00" },
      ])

      expect(result.map((row) => row.weight)).toEqual([
        "0.00",
        "0.00",
      ])
    })
  })
})
