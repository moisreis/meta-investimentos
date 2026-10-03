import { describe, it, expect, beforeEach } from "vitest"
import { zipSync, strToU8 } from "fflate"

import type { IFund } from "@domain/fund/interfaces/fund.interface"
import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import type { ICvmClient } from "@domain/quota/interfaces/cvm-client.interface"
import type { CvmCsvRow } from "@/services/quota/parsers/cvm-csv.parser"
import {
  ImportFundValuationsUseCase,
  type ImportMonthInput,
} from "@/services/quota/use-cases/import-fund-valuations.use-case"
import {
  createAllFakes,
  type FakeCvmClient,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildCnpj,
  buildEntityId,
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"

const FUND_ID = "00000000-0000-0000-0000-0000000000f1"
const OTHER_FUND_ID = "00000000-0000-0000-0000-0000000000f2"
const THIRD_FUND_ID = "00000000-0000-0000-0000-0000000000f3"

const CNPJ_A = buildUniqueCnpj("100000000001").value
const CNPJ_B = buildUniqueCnpj("200000000002").value
const UNTRACKED_CNPJ = buildUniqueCnpj("400000000004").value

const YEAR = 2026
const MONTH = 0

// Builds a real **CVM** monthly archive so the zip parser can inflate it.
function buildArchive(rows: CvmCsvRow[]): Buffer {
  const LINES = [
    "CNPJ_FUNDO;DT_COMPTC;VL_QUOTA",
    ...rows.map(
      (row) =>
        `${row.cnpj};${row.date.toISOString().slice(0, 10)};${row.price.replace(
          ".",
          ","
        )}`
    ),
  ]

  return Buffer.from(
    zipSync({
      "INF_DIARIO_202601.csv": strToU8(LINES.join("\n")),
    })
  )
}

describe("services/quota/use-cases/import-fund-valuations.use-case", () => {
  let quotaRepository: IQuota
  let fundRepository: IFund
  let cvmClient: FakeCvmClient

  const buildInput = (
    overrides: Partial<ImportMonthInput> = {}
  ): ImportMonthInput => ({
    year: YEAR,
    month: MONTH,
    start: new Date("2026-01-01T00:00:00.000Z"),
    end: new Date("2026-01-31T23:59:59.999Z"),
    offset: 0,
    limit: 10,
    ...overrides,
  })

  beforeEach(() => {
    const FAKES = createAllFakes()

    quotaRepository = FAKES.quota
    fundRepository = FAKES.fund
    cvmClient = FAKES.cvmClient
  })

  describe("importMonth", () => {
    it("should report an empty slice without downloading when no fund matches", async () => {
      let DOWNLOADED = false
      const NEVER_FETCHED: ICvmClient = {
        ...cvmClient,
        async fetchMonthlyFile() {
          DOWNLOADED = true

          return null
        },
      }
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        NEVER_FETCHED
      )

      const result = await useCase.importMonth(buildInput())

      expect(result).toEqual({
        fundsScanned: 0,
        hasMore: false,
        nextOffset: 0,
        rowsImported: 0,
        skipped: 0,
      })
      expect(DOWNLOADED).toBe(false)
    })

    it("should advance the offset when the slice is full of unpersisted funds", async () => {
      const UNPERSISTED: IFund = {
        ...fundRepository,
        async findAll() {
          return [
            buildFund({
              cnpj: buildCnpj(CNPJ_A),
              name: "Fundo Sem Identificador",
            }),
          ]
        },
      }
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        UNPERSISTED,
        cvmClient
      )

      const result = await useCase.importMonth(
        buildInput({ limit: 1 })
      )

      expect(result).toEqual({
        fundsScanned: 0,
        hasMore: true,
        nextOffset: 1,
        rowsImported: 0,
        skipped: 0,
      })
    })

    it("should import nothing when the month has no archive", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(buildInput())

      expect(result).toEqual({
        fundsScanned: 1,
        hasMore: false,
        nextOffset: 1,
        rowsImported: 0,
        skipped: 0,
      })
    })

    it("should persist the rows of the tracked funds when the archive is available", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId(OTHER_FUND_ID),
          cnpj: buildUniqueCnpj("200000000002"),
          name: "Fundo Beta",
        })
      )
      cvmClient.__setMonthlyFile(
        YEAR,
        MONTH,
        buildArchive([
          {
            cnpj: CNPJ_A,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "10.50",
          },
          {
            cnpj: CNPJ_B,
            date: new Date("2026-01-16T00:00:00.000Z"),
            price: "20.25",
          },
          {
            cnpj: CNPJ_A,
            date: new Date("2026-01-20T00:00:00.000Z"),
            price: "12.345678",
          },
        ])
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(buildInput())

      expect(result).toEqual({
        fundsScanned: 2,
        hasMore: false,
        nextOffset: 2,
        rowsImported: 3,
        skipped: 0,
      })

      const STORED = await quotaRepository.findAllByFundId(
        buildEntityId(FUND_ID)
      )

      expect(
        STORED.map((row) => row.date.toISOString())
      ).toEqual([
        "2026-01-15T00:00:00.000Z",
        "2026-01-20T00:00:00.000Z",
      ])
      expect(
        STORED.map((row) => row.price.value.toString())
      ).toEqual(["10.5", "12.345678"])
    })

    it("should count the rows outside the window as skipped", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      cvmClient.__setMonthlyFile(
        YEAR,
        MONTH,
        buildArchive([
          {
            cnpj: CNPJ_A,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "10.50",
          },
          {
            cnpj: CNPJ_A,
            date: new Date("2025-12-31T00:00:00.000Z"),
            price: "9.00",
          },
          {
            cnpj: CNPJ_A,
            date: new Date("2026-02-01T00:00:00.000Z"),
            price: "11.00",
          },
        ])
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(buildInput())

      expect(result.rowsImported).toBe(1)
      expect(result.skipped).toBe(2)
    })

    it("should ignore the rows of untracked cnpj values", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      cvmClient.__setMonthlyFile(
        YEAR,
        MONTH,
        buildArchive([
          {
            cnpj: UNTRACKED_CNPJ,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "99.00",
          },
        ])
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(buildInput())

      expect(result.rowsImported).toBe(0)
      expect(result.skipped).toBe(0)
    })

    it("should count the repeated fund and date rows as skipped", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      cvmClient.__setMonthlyFile(
        YEAR,
        MONTH,
        buildArchive([
          {
            cnpj: CNPJ_A,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "10.50",
          },
          {
            cnpj: CNPJ_A,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "10.75",
          },
        ])
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(buildInput())

      expect(result.rowsImported).toBe(1)
      expect(result.skipped).toBe(1)

      const STORED = await quotaRepository.findAllByFundId(
        buildEntityId(FUND_ID)
      )

      expect(STORED[0].price.value.toString()).toBe("10.5")
    })

    it("should signal more slices when the fund window is full", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId(FUND_ID),
          cnpj: buildUniqueCnpj("100000000001"),
          name: "Fundo Alpha",
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId(OTHER_FUND_ID),
          cnpj: buildUniqueCnpj("200000000002"),
          name: "Fundo Beta",
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId(THIRD_FUND_ID),
          cnpj: buildUniqueCnpj("300000000003"),
          name: "Fundo Gamma",
        })
      )
      cvmClient.__setMonthlyFile(
        YEAR,
        MONTH,
        buildArchive([
          {
            cnpj: CNPJ_B,
            date: new Date("2026-01-15T00:00:00.000Z"),
            price: "20.25",
          },
        ])
      )
      const useCase = new ImportFundValuationsUseCase(
        quotaRepository,
        fundRepository,
        cvmClient
      )

      const result = await useCase.importMonth(
        buildInput({ offset: 1, limit: 2 })
      )

      expect(result.fundsScanned).toBe(2)
      expect(result.hasMore).toBe(true)
      expect(result.nextOffset).toBe(3)
      expect(result.rowsImported).toBe(1)
    })
  })
})
