import { describe, it, expect } from "vitest"

import { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import {
  toCreateBenchmarkProps,
  toResponseDTO,
} from "@/services/benchmark/mappers/benchmark.mapper"
import {
  buildBenchmark,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000040"

describe("services/benchmark/mappers/benchmark.mapper", () => {
  describe("toCreateBenchmarkProps", () => {
    it("should carry the acronym and the name of the payload when mapping a create DTO", () => {
      const props = toCreateBenchmarkProps({
        acronym: "CDI",
        name: "Certificado de Depósito Interbancário",
      })

      expect(props.acronym).toBe("CDI")
      expect(props.name).toBe(
        "Certificado de Depósito Interbancário"
      )
    })

    it("should not carry the creation timestamp when mapping a create DTO", () => {
      const props = toCreateBenchmarkProps({
        acronym: "IBOV",
        name: "Ibovespa",
      })

      expect(props).not.toHaveProperty("createdAt")
    })

    it("should produce props accepted by Benchmark.create when mapping a create DTO", () => {
      const props = toCreateBenchmarkProps({
        acronym: "IFIX",
        name: "Índice de Fundos Imobiliários",
      })

      expect(() => Benchmark.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a benchmark", () => {
      const benchmark = buildBenchmark({ id: buildEntityId(ID) })

      const response = toResponseDTO(benchmark)

      expect(response.id).toBe(ID)
    })

    it("should carry the acronym and the name when serializing a benchmark", () => {
      const benchmark = buildBenchmark({
        acronym: "SMLL",
        name: "Small Caps",
      })

      const response = toResponseDTO(benchmark)

      expect(response.acronym).toBe("SMLL")
      expect(response.name).toBe("Small Caps")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a benchmark", () => {
      const benchmark = buildBenchmark({
        createdAt: new Date("2026-04-05T07:00:00.000Z"),
      })

      const response = toResponseDTO(benchmark)

      expect(response.createdAt).toBe("2026-04-05T07:00:00.000Z")
    })
  })
})
