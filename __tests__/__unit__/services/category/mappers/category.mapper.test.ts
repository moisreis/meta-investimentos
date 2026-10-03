import { describe, it, expect } from "vitest"

import { Category } from "@/domain/category/entities/category.entity"
import {
  toCreateCategoryProps,
  toResponseDTO,
} from "@/services/category/mappers/category.mapper"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000002"

describe("services/category/mappers/category.mapper", () => {
  describe("toCreateCategoryProps", () => {
    it("should carry the name of the payload when mapping a create DTO", () => {
      const props = toCreateCategoryProps({
        name: "Renda Fixa",
      })

      expect(props.name).toBe("Renda Fixa")
    })

    it("should not carry any other field when mapping a create DTO", () => {
      const props = toCreateCategoryProps({
        name: "Ações",
      })

      expect(Object.keys(props)).toStrictEqual(["name"])
    })

    it("should produce props accepted by Category.create when mapping a create DTO", () => {
      const props = toCreateCategoryProps({
        name: "Multimercado",
      })

      expect(() => Category.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a category", () => {
      const category = buildCategory({ id: buildEntityId(ID) })

      const response = toResponseDTO(category)

      expect(response.id).toBe(ID)
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a category", () => {
      const category = buildCategory({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(category)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })

    it("should carry the name when serializing a category", () => {
      const category = buildCategory({
        name: "Fundos Imobiliários",
      })

      const response = toResponseDTO(category)

      expect(response.name).toBe("Fundos Imobiliários")
    })

    it("should expose every field when serializing a category", () => {
      const category = buildCategory({
        name: "Internacional",
        id: buildEntityId(ID),
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
        updatedAt: new Date("2026-03-02T00:00:00.000Z"),
      })

      const response = toResponseDTO(category)

      expect(response).toStrictEqual({
        id: ID,
        name: "Internacional",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-02T00:00:00.000Z",
      })
    })
  })
})
