import { describe, it, expect, beforeEach } from "vitest"

import { DeleteBankAccountUseCase } from "@/services/bank-account/use-cases/delete-bank-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"

describe("services/bank-account/use-cases/delete-bank-account.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("DeleteBankAccountUseCase", () => {
    describe("execute", () => {
      it("should remove the row when the bank account exists", async () => {
        const saved = await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new DeleteBankAccountUseCase(
          bankAccountRepository
        )

        await useCase.execute({ bankAccountId: saved.id! })

        expect(
          await bankAccountRepository.findById(saved.id!)
        ).toBeNull()
      })

      it("should throw NotFoundError when the bank account does not exist", async () => {
        await bankAccountRepository.save(
          buildBankAccount({ id: buildEntityId(OTHER_ID) })
        )
        const useCase = new DeleteBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({ bankAccountId: ID })
        ).rejects.toThrow(NotFoundError)
      })

      it("should leave the other rows untouched when the bank account exists", async () => {
        const target = await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const other = await bankAccountRepository.save(
          buildBankAccount({
            agency: "0002",
            accountNumber: "23456-7",
            id: buildEntityId(OTHER_ID),
          })
        )
        const useCase = new DeleteBankAccountUseCase(
          bankAccountRepository
        )

        await useCase.execute({ bankAccountId: target.id! })

        expect(
          await bankAccountRepository.findById(other.id!)
        ).not.toBeNull()
      })
    })
  })
})
