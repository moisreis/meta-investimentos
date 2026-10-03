import { describe, it, expect, beforeEach } from "vitest"

import { DeleteStatementUseCase } from "@/services/statement/use-cases/delete-statement.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildStatement,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/statement/use-cases/delete-statement.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    statementRepository = createFakeStatementRepository()
  })

  describe("execute", () => {
    it("should remove the row when the statement exists", async () => {
      const saved = await statementRepository.save(
        buildStatement({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteStatementUseCase(
        statementRepository
      )

      await useCase.execute({ statementId: saved.id! })

      expect(
        await statementRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the statement does not exist", async () => {
      const useCase = new DeleteStatementUseCase(
        statementRepository
      )

      await expect(
        useCase.execute({ statementId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the statement exists", async () => {
      const target = await statementRepository.save(
        buildStatement({ id: buildEntityId(ID) })
      )
      const other = await statementRepository.save(
        buildStatement({
          periodStart: new Date("2026-02-01T00:00:00.000Z"),
          periodEnd: new Date("2026-02-28T23:59:59.000Z"),
        })
      )
      const useCase = new DeleteStatementUseCase(
        statementRepository
      )

      await useCase.execute({ statementId: target.id! })

      expect(
        await statementRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
