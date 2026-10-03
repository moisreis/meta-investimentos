import { describe, it, expect, beforeEach } from "vitest"

import { ListCheckingAccountsUseCase } from "@/services/checking-account/use-cases/list-checking-accounts.use-case"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

describe("services/checking-account/use-cases/list-checking-accounts.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should return every row when no pagination is given", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId("bank-account-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId("bank-account-2"),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListCheckingAccountsUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({})

      expect(response).toHaveLength(2)
    })

    it("should return the newest rows first when no pagination is given", async () => {
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId("bank-account-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      await checkingAccountRepository.save(
        buildCheckingAccount({
          bankAccountId: buildEntityId("bank-account-2"),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListCheckingAccountsUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({})

      expect(response.map((row) => row.date)).toEqual([
        "2026-01-20T00:00:00.000Z",
        "2026-01-10T00:00:00.000Z",
      ])
    })

    it("should return only the requested window when a limit is given", async () => {
      for (const DAY of [10, 20, 30]) {
        await checkingAccountRepository.save(
          buildCheckingAccount({
            bankAccountId: buildEntityId("bank-account-1"),
            date: new Date(`2026-01-${DAY}T00:00:00.000Z`),
          })
        )
      }
      const useCase = new ListCheckingAccountsUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({ limit: 2 })

      expect(response).toHaveLength(2)
    })

    it("should skip the first rows when an offset is given", async () => {
      for (const DAY of [10, 20, 30]) {
        await checkingAccountRepository.save(
          buildCheckingAccount({
            bankAccountId: buildEntityId("bank-account-1"),
            date: new Date(`2026-01-${DAY}T00:00:00.000Z`),
          })
        )
      }
      const useCase = new ListCheckingAccountsUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({
        limit: 2,
        offset: 2,
      })

      expect(response).toHaveLength(1)
      expect(response[0]!.date).toBe("2026-01-10T00:00:00.000Z")
    })

    it("should return an empty list when no row exists", async () => {
      const useCase = new ListCheckingAccountsUseCase(
        checkingAccountRepository
      )

      const response = await useCase.execute({})

      expect(response).toEqual([])
    })
  })
})
