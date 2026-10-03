import { describe, it, expect, beforeEach } from "vitest"

import { GetCheckingAccountUseCase } from "@/services/checking-account/use-cases/get-checking-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/checking-account/use-cases/get-checking-account.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should return the mapped entry when the row exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(ID),
          bankAccountId: buildEntityId("bank-account-7"),
          date: new Date("2026-01-15T00:00:00.000Z"),
          value: buildSignedMoney("-250.75"),
        })
      )
      const useCase = new GetCheckingAccountUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        checkingAccountId: saved.id!,
      })

      expect(response).toEqual({
        id: ID,
        bankAccountId: "bank-account-7",
        date: "2026-01-15T00:00:00.000Z",
        value: "-250.75",
      })
    })

    it("should throw NotFoundError when the row does not exist", async () => {
      const useCase = new GetCheckingAccountUseCase(
        checkingAccountRepository
      )

      await expect(
        useCase.execute({ checkingAccountId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should expose the id as a string when the row exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(ID) })
      )
      const useCase = new GetCheckingAccountUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        checkingAccountId: saved.id!,
      })

      expect(response.id).toBe(ID)
    })
  })
})
