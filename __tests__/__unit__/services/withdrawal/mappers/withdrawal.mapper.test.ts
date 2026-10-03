import { describe, it, expect } from "vitest"

import { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"
import {
  toCreateWithdrawalProps,
  toReverseWithdrawalProps,
  toResponseDTO,
} from "@/services/withdrawal/mappers/withdrawal.mapper"
import {
  buildWithdrawal,
  buildEntityId,
  buildPositiveMoney,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000090"

describe("services/withdrawal/mappers/withdrawal.mapper", () => {
  describe("toCreateWithdrawalProps", () => {
    it("should convert the position id into an EntityId when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.positionId).toBe("position-1")
    })

    it("should trim the position id when mapping a padded create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "  position-1  ",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.positionId).toBe("position-1")
    })

    it("should parse the date into a Date when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T09:30:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.date).toBeInstanceOf(Date)
      expect(props.date.toISOString()).toBe(
        "2026-01-15T09:30:00.000Z"
      )
    })

    it("should parse a date-only string into midnight UTC when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.date.toISOString()).toBe(
        "2026-01-15T00:00:00.000Z"
      )
    })

    it("should parse the amount into a PositiveMoney when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.amount.value.toString()).toBe("2500.75")
    })

    it("should round the amount to money precision when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.757",
        quotas: "120.75",
      })

      expect(props.amount.value.toFixed(2)).toBe("2500.76")
    })

    it("should parse the quotas into a QuotaQuantity when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.quotas.value.toString()).toBe("120.75")
    })

    it("should not carry the reversal fields when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props).not.toHaveProperty("reversedAt")
      expect(props).not.toHaveProperty("reversedByUserId")
    })

    it("should produce props accepted by Withdrawal.create when mapping a create DTO", () => {
      const props = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(() => Withdrawal.create(props)).not.toThrow()
    })
  })

  describe("toReverseWithdrawalProps", () => {
    it("should convert the reversing user id into an EntityId when mapping a reverse DTO", () => {
      const props = toReverseWithdrawalProps({
        reversedByUserId: "user-1",
      })

      expect(props.reversedByUserId).toBe("user-1")
    })

    it("should trim the reversing user id when mapping a padded reverse DTO", () => {
      const props = toReverseWithdrawalProps({
        reversedByUserId: "  user-1  ",
      })

      expect(props.reversedByUserId).toBe("user-1")
    })

    it("should only carry the reversing user id when mapping a reverse DTO", () => {
      const props = toReverseWithdrawalProps({
        reversedByUserId: "user-1",
      })

      expect(Object.keys(props)).toEqual(["reversedByUserId"])
    })

    it("should produce reversal props accepted by Withdrawal.create when merged with create props", () => {
      const createProps = toCreateWithdrawalProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })
      const reverseProps = toReverseWithdrawalProps({
        reversedByUserId: "user-1",
      })

      expect(() =>
        Withdrawal.create({ ...createProps, ...reverseProps })
      ).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.id).toBe(ID)
    })

    it("should carry the position id when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        positionId: buildEntityId("position-42"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.positionId).toBe("position-42")
    })

    it("should expose the date as an ISO 8601 string when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        date: new Date("2026-01-15T09:30:00.000Z"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.date).toBe("2026-01-15T09:30:00.000Z")
    })

    it("should expose the amount as a decimal string when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        amount: buildPositiveMoney("2500.75"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.amount).toBe("2500.75")
    })

    it("should expose the quotas as a decimal string when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        quotas: buildQuotaQuantity("120.75"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.quotas).toBe("120.75")
    })

    it("should expose a null reversal date when the withdrawal was not reversed", () => {
      const withdrawal = buildWithdrawal({ reversedAt: null })

      const response = toResponseDTO(withdrawal)

      expect(response.reversedAt).toBeNull()
    })

    it("should expose the reversal date as an ISO 8601 string when the withdrawal was reversed", () => {
      const withdrawal = buildWithdrawal({
        reversedAt: new Date("2026-02-20T18:00:00.000Z"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.reversedAt).toBe(
        "2026-02-20T18:00:00.000Z"
      )
    })

    it("should expose a null reversing user id when the withdrawal was not reversed", () => {
      const withdrawal = buildWithdrawal({
        reversedByUserId: null,
      })

      const response = toResponseDTO(withdrawal)

      expect(response.reversedByUserId).toBeNull()
    })

    it("should carry the reversing user id when the withdrawal was reversed", () => {
      const withdrawal = buildWithdrawal({
        reversedByUserId: buildEntityId("user-9"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.reversedByUserId).toBe("user-9")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a withdrawal", () => {
      const withdrawal = buildWithdrawal({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(withdrawal)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
