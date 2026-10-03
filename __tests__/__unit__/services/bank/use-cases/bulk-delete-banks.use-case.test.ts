import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteBanksUseCase } from "@/services/bank/use-cases/bulk-delete-banks.use-case"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const MISSING_ID = "00000000-0000-0000-0000-000000000009"

describe("services/bank/use-cases/bulk-delete-banks.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    bankRepository = createFakeBankRepository()
  })

  describe("BulkDeleteBanksUseCase", () => {
    describe("execute", () => {
      it("should remove every row when all banks exist", async () => {
        await bankRepository.save(
          buildBank({ code: "001", id: buildEntityId(FIRST_ID) })
        )
        await bankRepository.save(
          buildBank({
            code: "341",
            id: buildEntityId(SECOND_ID),
          })
        )
        const useCase = new BulkDeleteBanksUseCase(
          bankRepository
        )

        await useCase.execute({ bankIds: [FIRST_ID, SECOND_ID] })

        expect(await bankRepository.findAll({})).toStrictEqual(
          []
        )
        expect(
          await bankRepository.findById(buildEntityId(FIRST_ID))
        ).toBeNull()
        expect(
          await bankRepository.findById(buildEntityId(SECOND_ID))
        ).toBeNull()
      })

      it("should remove only the existing rows when a bank id is missing", async () => {
        await bankRepository.save(
          buildBank({ code: "001", id: buildEntityId(FIRST_ID) })
        )
        await bankRepository.save(
          buildBank({
            code: "341",
            id: buildEntityId(SECOND_ID),
          })
        )
        const useCase = new BulkDeleteBanksUseCase(
          bankRepository
        )

        await useCase.execute({
          bankIds: [SECOND_ID, MISSING_ID],
        })

        const stored = await bankRepository.findAll({})

        expect(stored).toHaveLength(1)
        expect(stored[0].id).toBe(FIRST_ID)
      })

      it("should keep every row when the bank id list is empty", async () => {
        await bankRepository.save(
          buildBank({ code: "001", id: buildEntityId(FIRST_ID) })
        )
        const useCase = new BulkDeleteBanksUseCase(
          bankRepository
        )

        await useCase.execute({ bankIds: [] })

        expect(await bankRepository.findAll({})).toHaveLength(1)
      })

      it("should keep every row when no bank matches the provided ids", async () => {
        await bankRepository.save(
          buildBank({ code: "001", id: buildEntityId(FIRST_ID) })
        )
        const useCase = new BulkDeleteBanksUseCase(
          bankRepository
        )

        await useCase.execute({ bankIds: [MISSING_ID] })

        expect(await bankRepository.findAll({})).toHaveLength(1)
        expect(
          await bankRepository.findById(buildEntityId(FIRST_ID))
        ).not.toBeNull()
      })
    })
  })
})
