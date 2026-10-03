import { describe, it, expect, beforeEach } from "vitest"

import { ListStatementsUseCase } from "@/services/statement/use-cases/list-statements.use-case"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildStatement,
} from "__tests__/__setup__/_factories.setup"

const PORTFOLIO_ID = "portfolio-1"
const OTHER_PORTFOLIO_ID = "portfolio-2"

describe("services/statement/use-cases/list-statements.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    statementRepository = createFakeStatementRepository()
  })

  describe("execute", () => {
    it("should return only the statements of the requested portfolio when other rows exist", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(OTHER_PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          fileUrl: "https://cdn.test/other.pdf",
        })
      )
      const useCase = new ListStatementsUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.portfolioId).toBe(PORTFOLIO_ID)
    })

    it("should return every statement of the portfolio when several periods exist", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T23:59:59.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(PORTFOLIO_ID),
          periodStart: new Date("2026-02-01T00:00:00.000Z"),
          periodEnd: new Date("2026-02-28T23:59:59.000Z"),
        })
      )
      const useCase = new ListStatementsUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response).toHaveLength(2)
    })

    it("should exclude portfolio-wide statements when the portfolio has own rows", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: null,
          periodStart: new Date("2026-03-01T00:00:00.000Z"),
          periodEnd: new Date("2026-03-31T23:59:59.000Z"),
        })
      )
      const useCase = new ListStatementsUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response).toHaveLength(1)
    })

    it("should return an empty list when the portfolio has no statements", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(OTHER_PORTFOLIO_ID),
        })
      )
      const useCase = new ListStatementsUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response).toEqual([])
    })
  })
})
