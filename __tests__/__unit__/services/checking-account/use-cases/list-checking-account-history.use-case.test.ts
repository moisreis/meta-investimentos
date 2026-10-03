import { describe, it, expect, beforeEach } from "vitest"

import { ListCheckingAccountHistoryUseCase } from "@/services/checking-account/use-cases/list-checking-account-history.use-case"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const BANK_ACCOUNT_ID = "bank-account-1"
const OTHER_BANK_ACCOUNT_ID = "bank-account-2"

describe("services/checking-account/use-cases/list-checking-account-history.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should return only the entries of the requested bank account when the ids differ", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(BANK_ACCOUNT_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(OTHER_BANK_ACCOUNT_ID),
          date: new Date("2026-01-11T00:00:00.000Z"),
        })
      )
      const useCase = new ListCheckingAccountHistoryUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.bankAccountId).toBe(BANK_ACCOUNT_ID)
    })

    it("should return the entries ordered by ascending date when several rows exist", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(BANK_ACCOUNT_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          value: buildSignedMoney("300.00"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(BANK_ACCOUNT_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          value: buildSignedMoney("100.00"),
        })
      )
      const useCase = new ListCheckingAccountHistoryUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
      })

      expect(response.map((row) => row.value)).toEqual([
        "100",
        "300",
      ])
    })

    it("should return an empty list when the bank account has no entries", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(OTHER_BANK_ACCOUNT_ID),
        })
      )
      const useCase = new ListCheckingAccountHistoryUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        bankAccountId: BANK_ACCOUNT_ID,
      })

      expect(response).toEqual([])
    })
  })
})
