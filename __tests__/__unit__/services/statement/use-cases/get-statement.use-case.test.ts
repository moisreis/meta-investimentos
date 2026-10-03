import { describe, it, expect, beforeEach } from "vitest"

import { GetStatementUseCase } from "@/services/statement/use-cases/get-statement.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildStatement,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/statement/use-cases/get-statement.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    statementRepository = createFakeStatementRepository()
  })

  describe("execute", () => {
    it("should return the mapped statement when the row exists", async () => {
      const saved = await statementRepository.save(
        buildStatement({
          id: buildEntityId(ID),
          portfolioId: buildEntityId("portfolio-7"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T23:59:59.000Z"),
          fileUrl: "https://cdn.test/january.pdf",
          generatedByUserId: buildEntityId("user-3"),
          createdAt: new Date("2026-02-01T10:00:00.000Z"),
        })
      )
      const useCase = new GetStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        statementId: saved.id!,
      })

      expect(response).toEqual({
        id: ID,
        portfolioId: "portfolio-7",
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T23:59:59.000Z",
        fileUrl: "https://cdn.test/january.pdf",
        generatedByUserId: "user-3",
        createdAt: "2026-02-01T10:00:00.000Z",
      })
    })

    it("should expose a null portfolio id when the statement is portfolio-wide", async () => {
      const saved = await statementRepository.save(
        buildStatement({
          id: buildEntityId(ID),
          portfolioId: null,
        })
      )
      const useCase = new GetStatementUseCase(
        statementRepository
      )

      const response = await useCase.execute({
        statementId: saved.id!,
      })

      expect(response.portfolioId).toBeNull()
    })

    it("should throw NotFoundError when the row does not exist", async () => {
      const useCase = new GetStatementUseCase(
        statementRepository
      )

      await expect(
        useCase.execute({ statementId: ID })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
