import { describe, it, expect, beforeEach } from "vitest"

import { ListStatementsByPortfoliosUseCase } from "@/services/statement/use-cases/list-statements-by-portfolios.use-case"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildStatement,
} from "__tests__/__setup__/_factories.setup"

const FIRST_PORTFOLIO_ID = "portfolio-1"
const SECOND_PORTFOLIO_ID = "portfolio-2"
const OTHER_PORTFOLIO_ID = "portfolio-3"

describe("services/statement/use-cases/list-statements-by-portfolios.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    statementRepository = createFakeStatementRepository()
  })

  describe("execute", () => {
    it("should return the statements of every requested portfolio when several ids are given", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(FIRST_PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(SECOND_PORTFOLIO_ID),
          periodStart: new Date("2026-02-01T00:00:00.000Z"),
          periodEnd: new Date("2026-02-28T23:59:59.000Z"),
        })
      )
      const useCase = new ListStatementsByPortfoliosUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO_ID, SECOND_PORTFOLIO_ID],
      })

      expect(
        response.map((row) => row.portfolioId).sort()
      ).toEqual([FIRST_PORTFOLIO_ID, SECOND_PORTFOLIO_ID].sort())
    })

    it("should exclude the statements of portfolios outside the list when other rows exist", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(FIRST_PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(OTHER_PORTFOLIO_ID),
          periodStart: new Date("2026-03-01T00:00:00.000Z"),
          periodEnd: new Date("2026-03-31T23:59:59.000Z"),
        })
      )
      const useCase = new ListStatementsByPortfoliosUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO_ID],
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.portfolioId).toBe(FIRST_PORTFOLIO_ID)
    })

    it("should exclude portfolio-wide statements when the id list has portfolios", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(FIRST_PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await statementRepository.save(
        buildStatement({
          portfolioId: null,
          periodStart: new Date("2026-04-01T00:00:00.000Z"),
          periodEnd: new Date("2026-04-30T23:59:59.000Z"),
        })
      )
      const useCase = new ListStatementsByPortfoliosUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO_ID],
      })

      expect(response).toHaveLength(1)
    })

    it("should return an empty list when the id list is empty", async () => {
      await statementRepository.save(
        buildStatement({
          portfolioId: buildEntityId(FIRST_PORTFOLIO_ID),
        })
      )
      const useCase = new ListStatementsByPortfoliosUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })
  })
})
