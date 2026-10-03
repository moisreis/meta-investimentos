import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteCheckingAccountsUseCase } from "@/services/checking-account/use-cases/bulk-delete-checking-accounts.use-case"
import { createFakeCheckingAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCheckingAccount,
  buildEntityId,
  buildSignedMoney,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000011"
const SECOND_ID = "00000000-0000-0000-0000-000000000012"
const MISSING_ID = "00000000-0000-0000-0000-000000000019"

describe("services/checking-account/use-cases/bulk-delete-checking-accounts.use-case", () => {
  let checkingAccountRepository: ReturnType<
    typeof createFakeCheckingAccountRepository
  >

  beforeEach(() => {
    checkingAccountRepository =
      createFakeCheckingAccountRepository()
  })

  describe("execute", () => {
    it("should remove every requested row when the ids exist", async () => {
      const first = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(FIRST_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          value: buildSignedMoney("100.00"),
        })
      )
      const second = await checkingAccountRepository.save(
        buildCheckingAccount({
          id: buildEntityId(SECOND_ID),
          date: new Date("2026-01-20T00:00:00.000Z"),
          value: buildSignedMoney("200.00"),
        })
      )
      const useCase = new BulkDeleteCheckingAccountsUseCase(
        checkingAccountRepository
      )

      await useCase.execute({
        checkingAccountIds: [FIRST_ID, SECOND_ID],
      })

      expect(
        await checkingAccountRepository.findAllByIds([
          first.id!,
          second.id!,
        ])
      ).toHaveLength(0)
    })

    it("should keep every row when the id list is empty", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteCheckingAccountsUseCase(
        checkingAccountRepository
      )

      await useCase.execute({ checkingAccountIds: [] })

      expect(
        await checkingAccountRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should keep every row when no requested id exists", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteCheckingAccountsUseCase(
        checkingAccountRepository
      )

      await useCase.execute({
        checkingAccountIds: [MISSING_ID],
      })

      expect(
        await checkingAccountRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should skip the missing ids when only some rows exist", async () => {
      const saved = await checkingAccountRepository.save(
        buildCheckingAccount({ id: buildEntityId(FIRST_ID) })
      )
      const useCase = new BulkDeleteCheckingAccountsUseCase(
        checkingAccountRepository
      )

      await useCase.execute({
        checkingAccountIds: [FIRST_ID, MISSING_ID],
      })

      expect(
        await checkingAccountRepository.findById(saved.id!)
      ).toBeNull()
    })
  })
})
