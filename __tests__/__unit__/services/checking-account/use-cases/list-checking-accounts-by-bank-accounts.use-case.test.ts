import { describe, it, expect, beforeEach } from "vitest"

import { ListCheckingAccountsByBankAccountsUseCase } from "@/services/checking-account/use-cases/list-checking-accounts-by-bank-accounts.use-case"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const FIRST_BANK_ACCOUNT_ID = "bank-account-1"
const SECOND_BANK_ACCOUNT_ID = "bank-account-2"
const OTHER_BANK_ACCOUNT_ID = "bank-account-3"

describe("services/checking-account/use-cases/list-checking-accounts-by-bank-accounts.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should return the entries of every requested bank account when several ids are given", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(FIRST_BANK_ACCOUNT_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          value: buildSignedMoney("100.00"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(SECOND_BANK_ACCOUNT_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          value: buildSignedMoney("200.00"),
        })
      )
      const useCase =
        new ListCheckingAccountsByBankAccountsUseCase(
          checkingAccountRepository
        )

      const response = await useCase.execute({
        bankAccountIds: [
          FIRST_BANK_ACCOUNT_ID,
          SECOND_BANK_ACCOUNT_ID,
        ],
      })

      expect(
        response.map((row) => row.bankAccountId).sort()
      ).toEqual(
        [FIRST_BANK_ACCOUNT_ID, SECOND_BANK_ACCOUNT_ID].sort()
      )
    })

    it("should exclude the entries of bank accounts outside the list when other rows exist", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(FIRST_BANK_ACCOUNT_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(OTHER_BANK_ACCOUNT_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase =
        new ListCheckingAccountsByBankAccountsUseCase(
          checkingAccountRepository
        )

      const response = await useCase.execute({
        bankAccountIds: [FIRST_BANK_ACCOUNT_ID],
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.bankAccountId).toBe(
        FIRST_BANK_ACCOUNT_ID
      )
    })

    it("should return an empty list when the id list is empty", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(FIRST_BANK_ACCOUNT_ID),
        })
      )
      const useCase =
        new ListCheckingAccountsByBankAccountsUseCase(
          checkingAccountRepository
        )

      const response = await useCase.execute({
        bankAccountIds: [],
      })

      expect(response).toEqual([])
    })

    it("should order the returned entries by ascending date when several rows match", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(FIRST_BANK_ACCOUNT_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          value: buildSignedMoney("200.00"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId(SECOND_BANK_ACCOUNT_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          value: buildSignedMoney("100.00"),
        })
      )
      const useCase =
        new ListCheckingAccountsByBankAccountsUseCase(
          checkingAccountRepository
        )

      const response = await useCase.execute({
        bankAccountIds: [
          FIRST_BANK_ACCOUNT_ID,
          SECOND_BANK_ACCOUNT_ID,
        ],
      })

      expect(response.map((row) => row.date)).toEqual([
        "2026-01-10T00:00:00.000Z",
        "2026-01-20T00:00:00.000Z",
      ])
    })
  })
})
