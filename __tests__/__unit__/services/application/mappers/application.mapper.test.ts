import { describe, it, expect } from "vitest"

import { Application } from "@/domain/application/entities/application.entity"
import {
  toCreateApplicationProps,
  toReverseApplicationProps,
  toResponseDTO,
} from "@/services/application/mappers/application.mapper"
import {
  buildApplication,
  buildEntityId,
  buildPositiveMoney,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000010"

describe("services/application/mappers/application.mapper", () => {
  describe("toCreateApplicationProps", () => {
    it("should convert the position id into an EntityId when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.positionId).toBe("position-1")
    })

    it("should parse the date into a Date when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.date).toBeInstanceOf(Date)
      expect(props.date.toISOString()).toBe(
        "2026-01-15T00:00:00.000Z"
      )
    })

    it("should parse a date-only string into midnight UTC when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
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
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.amount.value.toString()).toBe("2500.75")
    })

    it("should round the amount to money precision when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.757",
        quotas: "120.75",
      })

      expect(props.amount.value.toFixed(2)).toBe("2500.76")
    })

    it("should parse the quotas into a QuotaQuantity when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props.quotas.value.toString()).toBe("120.75")
    })

    it("should not carry the reversal fields when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(props).not.toHaveProperty("reversedAt")
      expect(props).not.toHaveProperty("reversedByUserId")
    })

    it("should produce props accepted by Application.create when mapping a create DTO", () => {
      const props = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(() => Application.create(props)).not.toThrow()
    })
  })

  describe("toReverseApplicationProps", () => {
    it("should convert the reversing user id into an EntityId when mapping a reverse DTO", () => {
      const props = toReverseApplicationProps({
        reversedByUserId: "user-1",
      })

      expect(props.reversedByUserId).toBe("user-1")
    })

    it("should only carry the reversing user id when mapping a reverse DTO", () => {
      const props = toReverseApplicationProps({
        reversedByUserId: "user-1",
      })

      expect(Object.keys(props)).toEqual(["reversedByUserId"])
    })

    it("should produce reversal props accepted by Application.create when merged with create props", () => {
      const createProps = toCreateApplicationProps({
        positionId: "position-1",
        date: "2026-01-15T00:00:00.000Z",
        amount: "2500.75",
        quotas: "120.75",
      })
      const reverseProps = toReverseApplicationProps({
        reversedByUserId: "user-1",
      })

      expect(() =>
        Application.create({ ...createProps, ...reverseProps })
      ).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing an application", () => {
      const application = buildApplication({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(application)

      expect(response.id).toBe(ID)
    })

    it("should carry the position id when serializing an application", () => {
      const application = buildApplication({
        positionId: buildEntityId("position-42"),
      })

      const response = toResponseDTO(application)

      expect(response.positionId).toBe("position-42")
    })

    it("should expose the date as an ISO 8601 string when serializing an application", () => {
      const application = buildApplication({
        date: new Date("2026-01-15T09:30:00.000Z"),
      })

      const response = toResponseDTO(application)

      expect(response.date).toBe("2026-01-15T09:30:00.000Z")
    })

    it("should expose the amount as a decimal string when serializing an application", () => {
      const application = buildApplication({
        amount: buildPositiveMoney("2500.75"),
      })

      const response = toResponseDTO(application)

      expect(response.amount).toBe("2500.75")
    })

    it("should expose the quotas as a decimal string when serializing an application", () => {
      const application = buildApplication({
        quotas: buildQuotaQuantity("120.75"),
      })

      const response = toResponseDTO(application)

      expect(response.quotas).toBe("120.75")
    })

    it("should expose a null reversal date when the application was not reversed", () => {
      const application = buildApplication({ reversedAt: null })

      const response = toResponseDTO(application)

      expect(response.reversedAt).toBeNull()
    })

    it("should expose the reversal date as an ISO 8601 string when the application was reversed", () => {
      const application = buildApplication({
        reversedAt: new Date("2026-02-20T18:00:00.000Z"),
      })

      const response = toResponseDTO(application)

      expect(response.reversedAt).toBe(
        "2026-02-20T18:00:00.000Z"
      )
    })

    it("should expose a null reversing user id when the application was not reversed", () => {
      const application = buildApplication({
        reversedByUserId: null,
      })

      const response = toResponseDTO(application)

      expect(response.reversedByUserId).toBeNull()
    })

    it("should carry the reversing user id when the application was reversed", () => {
      const application = buildApplication({
        reversedByUserId: buildEntityId("user-9"),
      })

      const response = toResponseDTO(application)

      expect(response.reversedByUserId).toBe("user-9")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing an application", () => {
      const application = buildApplication({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(application)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })
  })
})
