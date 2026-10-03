import { describe, it, expect, beforeEach } from "vitest"

import { UpdateCheckingAccountUseCase } from "@/services/checking-account/use-cases/update-checking-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/checking-account/use-cases/update-checking-account.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should return the new value when the entry exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(ID),
          value: buildSignedMoney("1000.00"),
        })
      )
      const useCase = new UpdateCheckingAccountUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        checkingAccountId: saved.id!,
        value: "-1234.56",
      })

      expect(response.value).toBe("-1234.56")
    })

    it("should persist the new value when the entry exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(ID),
          value: buildSignedMoney("1000.00"),
        })
      )
      const useCase = new UpdateCheckingAccountUseCase(
        checkingAccountRepository
      )

      await useCase.execute({
        checkingAccountId: saved.id!,
        value: "-1234.56",
      })

      const stored = await checkingAccountRepository.findById(
        saved.id!
      )

      expect(stored!.value.value.toFixed(2)).toBe("-1234.56")
    })

    it("should keep the bank account and the date when the entry exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(ID),
          bankAccountId: buildEntityId("bank-account-9"),
          date: new Date("2026-01-15T00:00:00.000Z"),
          value: buildSignedMoney("1000.00"),
        })
      )
      const useCase = new UpdateCheckingAccountUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        checkingAccountId: saved.id!,
        value: "42.00",
      })

      expect(response.bankAccountId).toBe("bank-account-9")
      expect(response.date).toBe("2026-01-15T00:00:00.000Z")
    })

    it("should throw NotFoundError when the entry does not exist", async () => {
      const useCase = new UpdateCheckingAccountUseCase(
        checkingAccountRepository
      )

      await expect(
        useCase.execute({
          checkingAccountId: ID,
          value: "-1234.56",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the value is not a number", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateCheckingAccountUseCase(
        checkingAccountRepository
      )

      await expect(
        useCase.execute({
          checkingAccountId: saved.id!,
          value: "not-a-number",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
