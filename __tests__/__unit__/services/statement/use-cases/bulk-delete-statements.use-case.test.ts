import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteStatementsUseCase } from "@/services/statement/use-cases/bulk-delete-statements.use-case"
import { createFakeStatementRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildStatement,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000041"
const SECOND_ID = "00000000-0000-0000-0000-000000000042"
const MISSING_ID = "00000000-0000-0000-0000-000000000049"

describe("services/statement/use-cases/bulk-delete-statements.use-case", () => {
  let statementRepository: ReturnType<
    typeof createFakeStatementRepository
  >

  beforeEach(() => {
    statementRepository = createFakeStatementRepository()
  })

  describe("execute", () => {
    it("should remove every requested row when the ids exist", async () => {
      const first = await statementRepository.save(
        buildStatement({ id: buildEntityId(FIRST_ID) })
      )
      const second = await statementRepository.save(
        buildStatement({
          id: buildEntityId(SECOND_ID),
          periodStart: new Date("2026-02-01T00:00:00.000Z"),
          periodEnd: new Date("2026-02-28T23:59:59.000Z"),
        })
      )
      const useCase = new BulkDeleteStatementsUseCase(
        statementRepository
      )

      await useCase.execute({
        statementIds: [FIRST_ID, SECOND_ID],
      })

      expect(
        await statementRepository.findById(first.id!)
      ).toBeNull()
      expect(
        await statementRepository.findById(second.id!)
      ).toBeNull()
    })

    it("should keep every row when the id list is empty", async () => {
      const saved = await statementRepository.save(
        buildStatement({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteStatementsUseCase(
        statementRepository
      )

      await useCase.execute({ statementIds: [] })

      expect(
        await statementRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should resolve without removing anything when no requested id exists", async () => {
      const saved = await statementRepository.save(
        buildStatement({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteStatementsUseCase(
        statementRepository
      )

      await useCase.execute({ statementIds: [MISSING_ID] })

      expect(
        await statementRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should remove only the existing rows when the list mixes found and missing ids", async () => {
      const saved = await statementRepository.save(
        buildStatement({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteStatementsUseCase(
        statementRepository
      )

      await useCase.execute({
        statementIds: [MISSING_ID, FIRST_ID],
      })

      expect(
        await statementRepository.findById(saved.id!)
      ).toBeNull()
    })
  })
})
