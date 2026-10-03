import { describe, it, expect } from "vitest"

import { CheckingAccount } from "@/domain/checking-account/entities/checking-account.entity"
import {
  toCreateCheckingAccountProps,
  toResponseDTO,
} from "@/services/checking-account/mappers/checking-account.mapper"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000003"

describe("services/checking-account/mappers/checking-account.mapper", () => {
  describe("toCreateCheckingAccountProps", () => {
    it("should convert the bank account id into an EntityId when mapping a create DTO", () => {
      const props = toCreateCheckingAccountProps({
        bankAccountId: "  bank-account-9  ",
        date: "2026-01-15T00:00:00.000Z",
        value: "1000.00",
      })

      expect(props.bankAccountId).toBe("bank-account-9")
    })

    it("should convert the date into a Date instance when mapping a create DTO", () => {
      const props = toCreateCheckingAccountProps({
        bankAccountId: "bank-account-1",
        date: "2026-01-15T10:30:00.000Z",
        value: "1000.00",
      })

      expect(props.date).toBeInstanceOf(Date)
      expect(props.date.toISOString()).toBe(
        "2026-01-15T10:30:00.000Z"
      )
    })

    it("should convert a positive value into a SignedMoney when mapping a create DTO", () => {
      const props = toCreateCheckingAccountProps({
        bankAccountId: "bank-account-1",
        date: "2026-01-15T00:00:00.000Z",
        value: "1500.75",
      })

      expect(props.value.value.toString()).toBe("1500.75")
      expect(props.value.value.toFixed(2)).toBe("1500.75")
    })

    it("should convert a negative value into a SignedMoney when mapping a create DTO", () => {
      const props = toCreateCheckingAccountProps({
        bankAccountId: "bank-account-1",
        date: "2026-01-15T00:00:00.000Z",
        value: "-123.45",
      })

      expect(props.value.value.toString()).toBe("-123.45")
      expect(props.value.value.toFixed(2)).toBe("-123.45")
    })

    it("should produce props accepted by CheckingAccount.create when mapping a create DTO", () => {
      const props = toCreateCheckingAccountProps({
        bankAccountId: "bank-account-1",
        date: "2026-01-15T00:00:00.000Z",
        value: "-250.00",
      })

      expect(() => CheckingAccount.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response.id).toBe(ID)
    })

    it("should carry the bank account id when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        bankAccountId: buildEntityId("bank-account-42"),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response.bankAccountId).toBe("bank-account-42")
    })

    it("should expose the date as an ISO 8601 string when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        date: new Date("2026-02-20T18:45:00.000Z"),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response.date).toBe("2026-02-20T18:45:00.000Z")
    })

    it("should carry a positive value as a decimal string when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        value: buildSignedMoney("2500.00"),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response.value).toBe("2500")
      expect(response.value).toBe(
        buildSignedMoney("2500.00").value.toString()
      )
    })

    it("should carry a negative value as a decimal string when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        value: buildSignedMoney("-123.45"),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response.value).toBe("-123.45")
    })

    it("should expose every field when serializing a checking account", () => {
      const checkingAccount = buildCheckingAccount({
        bankAccountId: buildEntityId("bank-account-7"),
        date: new Date("2026-03-10T08:00:00.000Z"),
        value: buildSignedMoney("-75.25"),
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(checkingAccount)

      expect(response).toStrictEqual({
        id: ID,
        bankAccountId: "bank-account-7",
        date: "2026-03-10T08:00:00.000Z",
        value: "-75.25",
      })
    })
  })
})
