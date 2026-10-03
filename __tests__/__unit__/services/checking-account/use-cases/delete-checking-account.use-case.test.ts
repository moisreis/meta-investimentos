import { describe, it, expect, beforeEach } from "vitest"

import { DeleteCheckingAccountUseCase } from "@/services/checking-account/use-cases/delete-checking-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/checking-account/use-cases/delete-checking-account.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should remove the row when the entry exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteCheckingAccountUseCase(
        checkingAccountRepository
      )

      await useCase.execute({ checkingAccountId: saved.id! })

      expect(
        await checkingAccountRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the entry does not exist", async () => {
      const useCase = new DeleteCheckingAccountUseCase(
        checkingAccountRepository
      )

      await expect(
        useCase.execute({ checkingAccountId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the entry exists", async () => {
      const target = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(ID) })
      )
      const other = await checkingAccountRepository.save(
        buildCheckingAccount({
          date: new Date("2026-02-20T00:00:00.000Z"),
        })
      )
      const useCase = new DeleteCheckingAccountUseCase(
        checkingAccountRepository
      )

      await useCase.execute({ checkingAccountId: target.id! })

      expect(
        await checkingAccountRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
