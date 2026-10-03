import { describe, it, expect } from "vitest"

import { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import {
  toCreateBankAccountProps,
  toResponseDTO,
} from "@/services/bank-account/mappers/bank-account.mapper"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000030"

describe("services/bank-account/mappers/bank-account.mapper", () => {
  describe("toCreateBankAccountProps", () => {
    it("should convert the portfolio id into an EntityId when mapping a create DTO", () => {
      const props = toCreateBankAccountProps({
        portfolioId: "portfolio-1",
        bankId: "bank-1",
        agency: "0001",
        accountNumber: "12345-6",
      })

      expect(props.portfolioId).toBe("portfolio-1")
    })

    it("should convert the bank id into an EntityId when mapping a create DTO", () => {
      const props = toCreateBankAccountProps({
        portfolioId: "portfolio-1",
        bankId: "bank-1",
        agency: "0001",
        accountNumber: "12345-6",
      })

      expect(props.bankId).toBe("bank-1")
    })

    it("should carry the agency and the account number when mapping a create DTO", () => {
      const props = toCreateBankAccountProps({
        portfolioId: "portfolio-1",
        bankId: "bank-1",
        agency: "4321",
        accountNumber: "98765-4",
      })

      expect(props.agency).toBe("4321")
      expect(props.accountNumber).toBe("98765-4")
    })

    it("should produce props accepted by BankAccount.create when mapping a create DTO", () => {
      const props = toCreateBankAccountProps({
        portfolioId: "portfolio-1",
        bankId: "bank-1",
        agency: "0001",
        accountNumber: "12345-6",
      })

      expect(() => BankAccount.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a bank account", () => {
      const bankAccount = buildBankAccount({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(bankAccount)

      expect(response.id).toBe(ID)
    })

    it("should carry the portfolio id and the bank id when serializing a bank account", () => {
      const bankAccount = buildBankAccount({
        portfolioId: buildEntityId("portfolio-88"),
        bankId: buildEntityId("bank-99"),
      })

      const response = toResponseDTO(bankAccount)

      expect(response.portfolioId).toBe("portfolio-88")
      expect(response.bankId).toBe("bank-99")
    })

    it("should carry the agency and the account number when serializing a bank account", () => {
      const bankAccount = buildBankAccount({
        agency: "1234",
        accountNumber: "56789-0",
      })

      const response = toResponseDTO(bankAccount)

      expect(response.agency).toBe("1234")
      expect(response.accountNumber).toBe("56789-0")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a bank account", () => {
      const bankAccount = buildBankAccount({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(bankAccount)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
