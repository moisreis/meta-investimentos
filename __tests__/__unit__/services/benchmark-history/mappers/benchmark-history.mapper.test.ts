import { describe, it, expect } from "vitest"

import { BenchmarkHistory } from "@/domain/benchmark-history/entities/benchmark-history.entity"
import {
  toCreateBenchmarkHistoryProps,
  toResponseDTO,
} from "@/services/benchmark-history/mappers/benchmark-history.mapper"
import {
  buildBenchmarkHistory,
  buildEntityId,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000050"

describe("services/benchmark-history/mappers/benchmark-history.mapper", () => {
  describe("toCreateBenchmarkHistoryProps", () => {
    it("should convert the benchmark id into an EntityId when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "10.75",
      })

      expect(props.benchmarkId).toBe("benchmark-1")
    })

    it("should parse the date into a Date when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "10.75",
      })

      expect(props.date).toBeInstanceOf(Date)
      expect(props.date.toISOString()).toBe(
        "2026-01-15T00:00:00.000Z"
      )
    })

    it("should parse the rate into a SignedPercentage when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "10.75",
      })

      expect(props.rate.value.toString()).toBe("10.75")
    })

    it("should keep the sign of a negative rate when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "-2.5",
      })

      expect(props.rate.value.toString()).toBe("-2.5")
    })

    it("should round the rate to percentage precision when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "10.757",
      })

      expect(props.rate.value.toFixed(2)).toBe("10.76")
    })

    it("should produce props accepted by BenchmarkHistory.create when mapping a create DTO", () => {
      const props = toCreateBenchmarkHistoryProps({
        benchmarkId: "benchmark-1",
        date: "2026-01-15T00:00:00.000Z",
        rate: "10.75",
      })

      expect(() => BenchmarkHistory.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.id).toBe(ID)
    })

    it("should carry the benchmark id when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        benchmarkId: buildEntityId("benchmark-77"),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.benchmarkId).toBe("benchmark-77")
    })

    it("should expose the date as an ISO 8601 string when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        date: new Date("2026-01-15T00:00:00.000Z"),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.date).toBe("2026-01-15T00:00:00.000Z")
    })

    it("should expose the rate as a decimal string when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        rate: buildSignedPercentage("10.75"),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.rate).toBe("10.75")
    })

    it("should expose a negative rate as a decimal string when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        rate: buildSignedPercentage("-2.5"),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.rate).toBe("-2.5")
    })

    it("should expose the creation timestamp as an ISO 8601 string when serializing a benchmark history", () => {
      const benchmarkHistory = buildBenchmarkHistory({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      const response = toResponseDTO(benchmarkHistory)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
    })
  })
})
