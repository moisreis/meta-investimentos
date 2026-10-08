import { describe, it, expect } from "vitest"
import { calculateNormCompliance } from "@/domain/norm/calculators/norm-compliance.calculator"

describe("domain/norm/calculators/norm-compliance.calculator", () => {
  describe("calculateNormCompliance", () => {
    it("should flag a policy inside its range as compliant", () => {
      const rows = calculateNormCompliance({
        policies: [
          {
            name: "Resolução 5.272/25",
            articleNumber: "Art. 7º I",
            categoryName: "Renda Fixa",
            targetAllocation: "100.00",
            minAllocation: "0.00",
            maxAllocation: "100.00",
          },
        ],
        allocation: [
          { categoryName: "Renda Fixa", weight: "100.00" },
        ],
      })

      expect(rows).toEqual([
        {
          articleNumber: "Art. 7º I",
          policy: "Resolução 5.272/25 - Art. 7º I",
          current: "100.00",
          target: "100.00",
          maximum: "100.00",
          minimum: "0.00",
          compliant: true,
        },
      ])
    })

    it("should flag a policy outside its range as non compliant", () => {
      const rows = calculateNormCompliance({
        policies: [
          {
            name: "Resolução 5.272/25",
            articleNumber: "Art. 8º II",
            categoryName: "Renda Variável",
            targetAllocation: "20.00",
            minAllocation: "0.00",
            maxAllocation: "20.00",
          },
        ],
        allocation: [
          { categoryName: "Renda Variável", weight: "35.00" },
        ],
      })

      expect(rows[0].compliant).toBe(false)
      expect(rows[0].current).toBe("35.00")
    })

    it("should resolve a category with no position as 0.00", () => {
      const rows = calculateNormCompliance({
        policies: [
          {
            name: "Resolução 5.272/25",
            articleNumber: "Art. 7º I",
            categoryName: "Renda Fixa",
            targetAllocation: "100.00",
            minAllocation: "0.00",
            maxAllocation: "100.00",
          },
        ],
        allocation: [],
      })

      expect(rows[0].current).toBe("0.00")
      expect(rows[0].compliant).toBe(true)
    })
  })
})
