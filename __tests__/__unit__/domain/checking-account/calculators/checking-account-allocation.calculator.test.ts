import { describe, it, expect } from "vitest"
import { calculateCheckingAccountAllocation } from "@/domain/checking-account/calculators/checking-account-allocation.calculator"

describe("domain/checking-account/calculators/checking-account-allocation.calculator", () => {
  describe("calculateCheckingAccountAllocation", () => {
    it("should return an empty list when there is no account", () => {
      const result = calculateCheckingAccountAllocation([])

      expect(result).toEqual([])
    })

    it("should keep one row per account and pass the identity through", () => {
      const result = calculateCheckingAccountAllocation([
        {
          institution: "Banco A",
          accountNumber: "1234",
          balance: "800.00",
        },
      ])

      expect(result).toEqual([
        {
          institution: "Banco A",
          accountNumber: "1234",
          balance: "800.00",
          weight: "100.00",
        },
      ])
    })

    it("should sort the accounts by balance, largest first", () => {
      const result = calculateCheckingAccountAllocation([
        {
          institution: "Banco A",
          accountNumber: "1234",
          balance: "200.00",
        },
        {
          institution: "Banco B",
          accountNumber: "5678",
          balance: "800.00",
        },
      ])

      expect(result.map((row) => row.institution)).toEqual([
        "Banco B",
        "Banco A",
      ])
    })

    it("should derive the weight of each account over the total", () => {
      const result = calculateCheckingAccountAllocation([
        {
          institution: "Banco B",
          accountNumber: "5678",
          balance: "750.00",
        },
        {
          institution: "Banco A",
          accountNumber: "1234",
          balance: "250.00",
        },
      ])

      expect(result.map((row) => row.weight)).toEqual([
        "75.00",
        "25.00",
      ])
    })

    it("should weigh every account as zero when the total balance is zero", () => {
      const result = calculateCheckingAccountAllocation([
        {
          institution: "Banco A",
          accountNumber: "1234",
          balance: "0.00",
        },
        {
          institution: "Banco B",
          accountNumber: "5678",
          balance: "0.00",
        },
      ])

      expect(result.map((row) => row.weight)).toEqual([
        "0.00",
        "0.00",
      ])
    })
  })
})
