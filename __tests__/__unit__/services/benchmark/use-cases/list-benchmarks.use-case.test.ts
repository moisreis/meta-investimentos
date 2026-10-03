import { describe, it, expect, beforeEach } from "vitest"

import { ListBenchmarksUseCase } from "@/services/benchmark/use-cases/list-benchmarks.use-case"
import { createFakeBenchmarkRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmark,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const THIRD_ID = "00000000-0000-0000-0000-000000000003"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/benchmark/use-cases/list-benchmarks.use-case", () => {
  let benchmarkRepository: ReturnType<
    typeof createFakeBenchmarkRepository
  >

  beforeEach(() => {
    benchmarkRepository = createFakeBenchmarkRepository()
  })

  describe("ListBenchmarksUseCase", () => {
    describe("execute", () => {
      it("should return the benchmarks in ascending name order when no pagination is given", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "CDI",
            name: "Certificado de Deposito",
            createdAt: CREATED_AT,
            id: buildEntityId(FIRST_ID),
          })
        )
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            createdAt: CREATED_AT,
            id: buildEntityId(SECOND_ID),
          })
        )
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "SELIC",
            name: "Taxa Selic",
            createdAt: CREATED_AT,
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBenchmarksUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({})

        expect(response).toStrictEqual([
          {
            id: FIRST_ID,
            acronym: "CDI",
            name: "Certificado de Deposito",
            createdAt: CREATED_AT.toISOString(),
          },
          {
            id: SECOND_ID,
            acronym: "IBOV",
            name: "Ibovespa",
            createdAt: CREATED_AT.toISOString(),
          },
          {
            id: THIRD_ID,
            acronym: "SELIC",
            name: "Taxa Selic",
            createdAt: CREATED_AT.toISOString(),
          },
        ])
      })

      it("should return the requested page when limit and offset are given", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "CDI",
            name: "Certificado de Deposito",
            id: buildEntityId(FIRST_ID),
          })
        )
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(SECOND_ID),
          })
        )
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "SELIC",
            name: "Taxa Selic",
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBenchmarksUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          limit: 2,
          offset: 1,
        })

        expect(
          response.map((benchmark) => benchmark.acronym)
        ).toStrictEqual(["IBOV", "SELIC"])
      })

      it("should return an empty list when no benchmark is stored", async () => {
        const useCase = new ListBenchmarksUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({})

        expect(response).toStrictEqual([])
      })
    })
  })
})
