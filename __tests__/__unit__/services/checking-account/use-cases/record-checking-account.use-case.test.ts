import { describe, it, expect, beforeEach } from "vitest"

import { RecordCheckingAccountUseCase } from "@/services/checking-account/use-cases/record-checking-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakeBankAccountRepository,
  createFakeCheckingAccountRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const BANK_ACCOUNT_ID = "00000000-0000-0000-0000-000000000031"
const MISSING_BANK_ACCOUNT_ID =
  "00000000-0000-0000-0000-000000000032"

describe("services/checking-account/use-cases/record-checking-account.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("execute", () => {
    it("should persist the entry built from the payload when the bank account exists", async () => {
      await bankAccountRepository.save(
        buildBankAccount({ id: buildEntityId(BANK_ACCOUNT_ID) })
      )
      const useCase = new RecordCheckingAccountUseCase(
        checkingAccountRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
        date: "2026-03-01T00:00:00.000Z",
        value: "15000.75",
      })

      expect(response.bankAccountId).toBe(BANK_ACCOUNT_ID)
      expect(response.date).toBe("2026-03-01T00:00:00.000Z")
      expect(response.value).toBe("15000.75")
      expect(response.id).toBeDefined()
    })

    it("should store exactly one row when the bank account exists", async () => {
      await bankAccountRepository.save(
        buildBankAccount({ id: buildEntityId(BANK_ACCOUNT_ID) })
      )
      const useCase = new RecordCheckingAccountUseCase(
        checkingAccountRepository,
        bankAccountRepository
      )

      await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
        date: "2026-03-01T00:00:00.000Z",
        value: "15000.75",
      })

      const stored = await checkingAccountRepository.findAll({})

      expect(stored).toHaveLength(1)
    })

    it("should accept a negative value when the bank account exists", async () => {
      await bankAccountRepository.save(
        buildBankAccount({ id: buildEntityId(BANK_ACCOUNT_ID) })
      )
      const useCase = new RecordCheckingAccountUseCase(
        checkingAccountRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
        date: "2026-03-01T00:00:00.000Z",
        value: "-250.50",
      })

      expect(response.value).toBe("-250.5")
    })

    it("should throw NotFoundError when the bank account does not exist", async () => {
      const useCase = new RecordCheckingAccountUseCase(
        checkingAccountRepository,
        bankAccountRepository
      )

      await expect(
        useCase.execute({
          bankAccountId: MISSING_BANK_ACCOUNT_ID,
          date: "2026-03-01T00:00:00.000Z",
          value: "15000.75",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should store no row when the bank account does not exist", async () => {
      const useCase = new RecordCheckingAccountUseCase(
        checkingAccountRepository,
        bankAccountRepository
      )

      await expect(
        useCase.execute({
          bankAccountId: MISSING_BANK_ACCOUNT_ID,
          date: "2026-03-01T00:00:00.000Z",
          value: "15000.75",
        })
      ).rejects.toThrow(NotFoundError)

      expect(
        await checkingAccountRepository.findAll({})
      ).toHaveLength(0)
    })
  })
})
