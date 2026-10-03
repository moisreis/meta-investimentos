import { describe, it, expect } from "vitest"

import { Statement } from "@/domain/statement/entities/statement.entity"
import {
  toCreateStatementProps,
  toResponseDTO,
} from "@/services/statement/mappers/statement.mapper"
import {
  buildStatement,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000060"

describe("services/statement/mappers/statement.mapper", () => {
  describe("toCreateStatementProps", () => {
    it("should convert the portfolio id into an EntityId when the payload carries one", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        generatedByUserId: "user-1",
      })

      expect(props.portfolioId).toBe("portfolio-1")
    })

    it("should fall back to a null portfolio id when the payload omits it", () => {
      const props = toCreateStatementProps({
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
      })

      expect(props.portfolioId).toBeNull()
    })

    it("should fall back to a null portfolio id when the payload carries null", () => {
      const props = toCreateStatementProps({
        portfolioId: null,
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
      })

      expect(props.portfolioId).toBeNull()
    })

    it("should parse the period start into a Date when mapping a generate DTO", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
      })

      expect(props.periodStart).toBeInstanceOf(Date)
      expect(props.periodStart.toISOString()).toBe(
        "2026-01-01T00:00:00.000Z"
      )
    })

    it("should parse a date-only period start into midnight UTC when mapping a generate DTO", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-02-01",
        periodEnd: "2026-02-28T23:59:59.000Z",
      })

      expect(props.periodStart.toISOString()).toBe(
        "2026-02-01T00:00:00.000Z"
      )
    })

    it("should parse the period end into a Date when mapping a generate DTO", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
      })

      expect(props.periodEnd).toBeInstanceOf(Date)
      expect(props.periodEnd.toISOString()).toBe(
        "2026-01-31T23:59:59.000Z"
      )
    })

    it("should convert the generating user id into an EntityId when the payload carries one", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        generatedByUserId: "user-42",
      })

      expect(props.generatedByUserId).toBe("user-42")
    })

    it("should fall back to a null generating user id when the payload omits it", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
      })

      expect(props.generatedByUserId).toBeNull()
    })

    it("should fall back to a null generating user id when the payload carries null", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        generatedByUserId: null,
      })

      expect(props.generatedByUserId).toBeNull()
    })

    it("should omit the file url when mapping a generate DTO", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        generatedByUserId: "user-1",
      })

      expect(props).not.toHaveProperty("fileUrl")
    })

    it("should produce props accepted by Statement.create when the file url is supplied downstream", () => {
      const props = toCreateStatementProps({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        generatedByUserId: "user-1",
      })

      expect(() =>
        Statement.create({
          ...props,
          fileUrl: "https://cdn.test/statement.pdf",
        })
      ).not.toThrow()
    })

    it("should produce props accepted by Statement.create for a portfolio-wide statement", () => {
      const props = toCreateStatementProps({
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
      })

      expect(() =>
        Statement.create({
          ...props,
          fileUrl: "https://cdn.test/consolidated.pdf",
        })
      ).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a statement", () => {
      const statement = buildStatement({ id: buildEntityId(ID) })

      const response = toResponseDTO(statement)

      expect(response.id).toBe(ID)
    })

    it("should carry the portfolio id when the statement belongs to a portfolio", () => {
      const statement = buildStatement({
        portfolioId: buildEntityId("portfolio-42"),
      })

      const response = toResponseDTO(statement)

      expect(response.portfolioId).toBe("portfolio-42")
    })

    it("should expose a null portfolio id when the statement is portfolio-wide", () => {
      const statement = buildStatement({ portfolioId: null })

      const response = toResponseDTO(statement)

      expect(response.portfolioId).toBeNull()
    })

    it("should expose the period start as an ISO 8601 string when serializing a statement", () => {
      const statement = buildStatement({
        periodStart: new Date("2026-01-01T00:00:00.000Z"),
      })

      const response = toResponseDTO(statement)

      expect(response.periodStart).toBe(
        "2026-01-01T00:00:00.000Z"
      )
    })

    it("should expose the period end as an ISO 8601 string when serializing a statement", () => {
      const statement = buildStatement({
        periodEnd: new Date("2026-01-31T23:59:59.000Z"),
      })

      const response = toResponseDTO(statement)

      expect(response.periodEnd).toBe("2026-01-31T23:59:59.000Z")
    })

    it("should carry the file url when serializing a statement", () => {
      const statement = buildStatement({
        fileUrl: "https://cdn.test/february.pdf",
      })

      const response = toResponseDTO(statement)

      expect(response.fileUrl).toBe(
        "https://cdn.test/february.pdf"
      )
    })

    it("should carry the generating user id when the statement was generated by a user", () => {
      const statement = buildStatement({
        generatedByUserId: buildEntityId("user-7"),
      })

      const response = toResponseDTO(statement)

      expect(response.generatedByUserId).toBe("user-7")
    })

    it("should expose a null generating user id when the statement has no author", () => {
      const statement = buildStatement({
        generatedByUserId: null,
      })

      const response = toResponseDTO(statement)

      expect(response.generatedByUserId).toBeNull()
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a statement", () => {
      const statement = buildStatement({
        createdAt: new Date("2026-03-01T08:45:00.000Z"),
      })

      const response = toResponseDTO(statement)

      expect(response.createdAt).toBe("2026-03-01T08:45:00.000Z")
    })
  })
})
