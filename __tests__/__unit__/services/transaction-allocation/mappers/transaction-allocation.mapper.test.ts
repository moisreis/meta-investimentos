import { describe, it, expect } from "vitest"

import { TransactionAllocation } from "@/domain/transaction-allocation/entities/transaction-allocation.entity"
import {
  toCreateTransactionAllocationProps,
  toResponseDTO,
} from "@/services/transaction-allocation/mappers/transaction-allocation.mapper"
import {
  buildTransactionAllocation,
  buildEntityId,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000070"

describe("services/transaction-allocation/mappers/transaction-allocation.mapper", () => {
  describe("toCreateTransactionAllocationProps", () => {
    it("should convert the application id into an EntityId when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-1",
        quotasConsumed: "250",
      })

      expect(props.applicationId).toBe("application-1")
    })

    it("should trim the application id when mapping a padded create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "  application-1  ",
        withdrawId: "withdrawal-1",
        quotasConsumed: "250",
      })

      expect(props.applicationId).toBe("application-1")
    })

    it("should convert the withdrawal id into an EntityId when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-42",
        quotasConsumed: "250",
      })

      expect(props.withdrawId).toBe("withdrawal-42")
    })

    it("should parse the consumed quotas into a QuotaQuantity when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-1",
        quotasConsumed: "250.5",
      })

      expect(props.quotasConsumed.value.toString()).toBe("250.5")
    })

    it("should round the consumed quotas to quantity precision when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-1",
        quotasConsumed: "120.1234567",
      })

      expect(props.quotasConsumed.value.toFixed(6)).toBe(
        "120.123457"
      )
    })

    it("should not carry the version or the creation timestamp when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-1",
        quotasConsumed: "250",
      })

      expect(props).not.toHaveProperty("version")
      expect(props).not.toHaveProperty("createdAt")
    })

    it("should produce props accepted by TransactionAllocation.create when mapping a create DTO", () => {
      const props = toCreateTransactionAllocationProps({
        applicationId: "application-1",
        withdrawId: "withdrawal-1",
        quotasConsumed: "250",
      })

      expect(() =>
        TransactionAllocation.create(props)
      ).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing an allocation", () => {
      const allocation = buildTransactionAllocation({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(allocation)

      expect(response.id).toBe(ID)
    })

    it("should carry the application id when serializing an allocation", () => {
      const allocation = buildTransactionAllocation({
        applicationId: buildEntityId("application-77"),
      })

      const response = toResponseDTO(allocation)

      expect(response.applicationId).toBe("application-77")
    })

    it("should carry the withdrawal id when serializing an allocation", () => {
      const allocation = buildTransactionAllocation({
        withdrawId: buildEntityId("withdrawal-88"),
      })

      const response = toResponseDTO(allocation)

      expect(response.withdrawId).toBe("withdrawal-88")
    })

    it("should expose the consumed quotas as a decimal string when serializing an allocation", () => {
      const allocation = buildTransactionAllocation({
        quotasConsumed: buildQuotaQuantity("250.75"),
      })

      const response = toResponseDTO(allocation)

      expect(response.quotasConsumed).toBe("250.75")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing an allocation", () => {
      const allocation = buildTransactionAllocation({
        createdAt: new Date("2026-04-05T10:15:00.000Z"),
      })

      const response = toResponseDTO(allocation)

      expect(response.createdAt).toBe("2026-04-05T10:15:00.000Z")
    })
  })
})
