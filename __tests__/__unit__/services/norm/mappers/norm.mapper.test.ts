import { describe, it, expect } from "vitest"

import { Norm } from "@/domain/norm/entities/norm.entity"
import {
  toCreateNormProps,
  toResponseDTO,
} from "@/services/norm/mappers/norm.mapper"
import {
  buildEntityId,
  buildNorm,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000005"

describe("services/norm/mappers/norm.mapper", () => {
  describe("toCreateNormProps", () => {
    it("should carry the article number when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.articleNumber).toBe("Art. 12")
    })

    it("should carry the name when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.name).toBe("Limite de Concentração")
    })

    it("should convert the category id into an EntityId when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "  category-21  ",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.categoryId).toBe("category-21")
    })

    it("should convert the minimum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5.25",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(props.minAllocation.value.toString()).toBe("5.25")
      expect(props.minAllocation.value.toFixed(2)).toBe("5.25")
    })

    it("should convert the maximum allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "40.75",
        targetAllocation: "12",
      })

      expect(props.maxAllocation.value.toString()).toBe("40.75")
      expect(props.maxAllocation.value.toFixed(2)).toBe("40.75")
    })

    it("should convert the target allocation into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12.50",
      })

      expect(props.targetAllocation.value.toString()).toBe(
        "12.5"
      )
      expect(props.targetAllocation.value.toFixed(2)).toBe(
        "12.50"
      )
    })

    it("should produce props accepted by Norm.create when mapping a create DTO", () => {
      const props = toCreateNormProps({
        articleNumber: "Art. 42",
        name: "Limite de Exposição",
        categoryId: "category-3",
        minAllocation: "10",
        maxAllocation: "60",
        targetAllocation: "35",
      })

      expect(() => Norm.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a norm", () => {
      const norm = buildNorm({ id: buildEntityId(ID) })

      const response = toResponseDTO(norm)

      expect(response.id).toBe(ID)
    })

    it("should carry the article number when serializing a norm", () => {
      const norm = buildNorm({ articleNumber: "Art. 7" })

      const response = toResponseDTO(norm)

      expect(response.articleNumber).toBe("Art. 7")
    })

    it("should carry the name when serializing a norm", () => {
      const norm = buildNorm({ name: "Reserva de Caixa" })

      const response = toResponseDTO(norm)

      expect(response.name).toBe("Reserva de Caixa")
    })

    it("should carry the category id when serializing a norm", () => {
      const norm = buildNorm({
        categoryId: buildEntityId("category-11"),
      })

      const response = toResponseDTO(norm)

      expect(response.categoryId).toBe("category-11")
    })

    it("should carry the minimum allocation as a decimal string when serializing a norm", () => {
      const norm = buildNorm({
        minAllocation: buildSignedPercentage("5.25"),
      })

      const response = toResponseDTO(norm)

      expect(response.minAllocation).toBe("5.25")
    })

    it("should carry the maximum allocation as a decimal string when serializing a norm", () => {
      const norm = buildNorm({
        maxAllocation: buildSignedPercentage("40.75"),
      })

      const response = toResponseDTO(norm)

      expect(response.maxAllocation).toBe("40.75")
    })

    it("should carry the target allocation as a decimal string when serializing a norm", () => {
      const norm = buildNorm({
        targetAllocation: buildSignedPercentage("12.50"),
      })

      const response = toResponseDTO(norm)

      expect(response.targetAllocation).toBe("12.5")
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a norm", () => {
      const norm = buildNorm({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(norm)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })

    it("should expose every field when serializing a norm", () => {
      const norm = buildNorm({
        articleNumber: "Art. 99",
        name: "Limite Global",
        categoryId: buildEntityId("category-4"),
        minAllocation: buildSignedPercentage("3.50"),
        maxAllocation: buildSignedPercentage("25.00"),
        targetAllocation: buildSignedPercentage("15.00"),
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
        updatedAt: new Date("2026-05-02T00:00:00.000Z"),
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(norm)

      expect(response).toStrictEqual({
        id: ID,
        articleNumber: "Art. 99",
        name: "Limite Global",
        categoryId: "category-4",
        minAllocation: "3.5",
        maxAllocation: "25",
        targetAllocation: "15",
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-02T00:00:00.000Z",
      })
    })
  })
})
