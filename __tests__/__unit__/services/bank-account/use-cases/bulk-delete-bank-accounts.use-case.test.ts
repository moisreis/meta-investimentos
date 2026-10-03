import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteBankAccountsUseCase } from "@/services/bank-account/use-cases/bulk-delete-bank-accounts.use-case"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const MISSING_ID = "00000000-0000-0000-0000-000000000009"

describe("services/bank-account/use-cases/bulk-delete-bank-accounts.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("BulkDeleteBankAccountsUseCase", () => {
    describe("execute", () => {
      it("should remove every row when all bank accounts exist", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "11111-1",
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0002",
            accountNumber: "22222-2",
            id: buildEntityId(SECOND_ID),
          })
        )
        const useCase = new BulkDeleteBankAccountsUseCase(
          bankAccountRepository
        )

        await useCase.execute({
          bankAccountIds: [FIRST_ID, SECOND_ID],
        })

        expect(
          await bankAccountRepository.findAll({})
        ).toStrictEqual([])
        expect(
          await bankAccountRepository.findById(
            buildEntityId(FIRST_ID)
          )
        ).toBeNull()
        expect(
          await bankAccountRepository.findById(
            buildEntityId(SECOND_ID)
          )
        ).toBeNull()
      })

      it("should remove only the existing rows when a bank account id is missing", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "11111-1",
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0002",
            accountNumber: "22222-2",
            id: buildEntityId(SECOND_ID),
          })
        )
        const useCase = new BulkDeleteBankAccountsUseCase(
          bankAccountRepository
        )

        await useCase.execute({
          bankAccountIds: [SECOND_ID, MISSING_ID],
        })

        const stored = await bankAccountRepository.findAll({})

        expect(stored).toHaveLength(1)
        expect(stored[0].id).toBe(FIRST_ID)
      })

      it("should keep every row when the bank account id list is empty", async () => {
        await bankAccountRepository.save(
          buildBankAccount({ id: buildEntityId(FIRST_ID) })
        )
        const useCase = new BulkDeleteBankAccountsUseCase(
          bankAccountRepository
        )

        await useCase.execute({ bankAccountIds: [] })

        expect(
          await bankAccountRepository.findAll({})
        ).toHaveLength(1)
      })
    })
  })
})
