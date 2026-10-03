import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { GenerateStatementUseCase } from "@/services/statement/use-cases/generate-statement.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const FILE_URL = "https://storage.example.com/s1.pdf"

describe("services/statement/use-cases/generate-statement.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    useFixedClock()
    statementRepository = createFakeStatementRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist the statement built from the payload when a portfolio is given", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        generatedByUserId: "user-1",
        fileUrl: FILE_URL,
      })

      expect(response.portfolioId).toBe("portfolio-1")
      expect(response.generatedByUserId).toBe("user-1")
      expect(response.fileUrl).toBe(FILE_URL)
      expect(response.id).toBeDefined()
    })

    it("should store exactly one row when generating a statement", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      const stored =
        await statementRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )

      expect(stored).toHaveLength(1)
    })

    it("should expose a null portfolio id when the payload omits it", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      expect(response.portfolioId).toBeNull()
    })

    it("should expose a null portfolio id when the payload carries null", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: null,
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      expect(response.portfolioId).toBeNull()
    })

    it("should expose a null generating user id when the payload omits it", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      expect(response.generatedByUserId).toBeNull()
    })

    it("should expose a null generating user id when the payload carries null", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        generatedByUserId: null,
        fileUrl: FILE_URL,
      })

      expect(response.generatedByUserId).toBeNull()
    })

    it("should expose the period as ISO 8601 strings when generating a statement", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      expect(response.periodStart).toBe(
        "2026-01-01T00:00:00.000Z"
      )
      expect(response.periodEnd).toBe("2026-01-31T23:59:59.000Z")
    })

    it("should stamp the creation date from the clock when generating a statement", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: FILE_URL,
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw ValidationError when the period start is after the period end", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          periodStart: "2026-01-31T00:00:00.000Z",
          periodEnd: "2026-01-01T00:00:00.000Z",
          fileUrl: FILE_URL,
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should store no row when the period start is after the period end", async () => {
      const useCase = new GenerateStatementUseCase(
        statementRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          periodStart: "2026-01-31T00:00:00.000Z",
          periodEnd: "2026-01-01T00:00:00.000Z",
          fileUrl: FILE_URL,
        })
      ).rejects.toThrow(ValidationError)

      const stored =
        await statementRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )

      expect(stored).toHaveLength(0)
    })
  })
})
