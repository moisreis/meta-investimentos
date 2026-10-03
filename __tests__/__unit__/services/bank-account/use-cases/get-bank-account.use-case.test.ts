import { describe, it, expect, beforeEach } from "vitest"

import { GetBankAccountUseCase } from "@/services/bank-account/use-cases/get-bank-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000010"
const BANK_ID = "00000000-0000-0000-0000-000000000020"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")
const UPDATED_AT = new Date("2026-02-15T12:00:00.000Z")

describe("services/bank-account/use-cases/get-bank-account.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("GetBankAccountUseCase", () => {
    describe("execute", () => {
      it("should return the full response when the bank account exists", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            portfolioId: buildEntityId(PORTFOLIO_ID),
            bankId: buildEntityId(BANK_ID),
            agency: "0001",
            accountNumber: "12345-6",
            createdAt: CREATED_AT,
            updatedAt: UPDATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new GetBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
        })

        expect(response).toStrictEqual({
          id: ID,
          portfolioId: PORTFOLIO_ID,
          bankId: BANK_ID,
          agency: "0001",
          accountNumber: "12345-6",
          createdAt: CREATED_AT.toISOString(),
          updatedAt: UPDATED_AT.toISOString(),
        })
      })

      it("should return only the requested row when several bank accounts exist", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0002",
            accountNumber: "23456-7",
            id: buildEntityId(OTHER_ID),
          })
        )
        const useCase = new GetBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: OTHER_ID,
        })

        expect(response.id).toBe(OTHER_ID)
        expect(response.agency).toBe("0002")
        expect(response.accountNumber).toBe("23456-7")
      })

      it("should throw NotFoundError when the bank account does not exist", async () => {
        await bankAccountRepository.save(
          buildBankAccount({ id: buildEntityId(OTHER_ID) })
        )
        const useCase = new GetBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({ bankAccountId: ID })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
