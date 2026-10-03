import { describe, it, expect, beforeEach } from "vitest"

import { ListBankAccountsUseCase } from "@/services/bank-account/use-cases/list-bank-accounts.use-case"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const THIRD_ID = "00000000-0000-0000-0000-000000000003"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000010"
const BANK_ID = "00000000-0000-0000-0000-000000000020"
const FIRST_DATE = new Date("2026-01-01T00:00:00.000Z")
const SECOND_DATE = new Date("2026-02-01T00:00:00.000Z")
const THIRD_DATE = new Date("2026-03-01T00:00:00.000Z")

describe("services/bank-account/use-cases/list-bank-accounts.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("ListBankAccountsUseCase", () => {
    describe("execute", () => {
      it("should return the bank accounts oldest first when no pagination is given", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            portfolioId: buildEntityId(PORTFOLIO_ID),
            bankId: buildEntityId(BANK_ID),
            agency: "0001",
            accountNumber: "12345-6",
            createdAt: FIRST_DATE,
            updatedAt: FIRST_DATE,
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            portfolioId: buildEntityId(PORTFOLIO_ID),
            bankId: buildEntityId(BANK_ID),
            agency: "0002",
            accountNumber: "23456-7",
            createdAt: SECOND_DATE,
            updatedAt: SECOND_DATE,
            id: buildEntityId(SECOND_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            portfolioId: buildEntityId(PORTFOLIO_ID),
            bankId: buildEntityId(BANK_ID),
            agency: "0003",
            accountNumber: "34567-8",
            createdAt: THIRD_DATE,
            updatedAt: THIRD_DATE,
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBankAccountsUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({})

        expect(response).toStrictEqual([
          {
            id: FIRST_ID,
            portfolioId: PORTFOLIO_ID,
            bankId: BANK_ID,
            agency: "0001",
            accountNumber: "12345-6",
            createdAt: FIRST_DATE.toISOString(),
            updatedAt: FIRST_DATE.toISOString(),
          },
          {
            id: SECOND_ID,
            portfolioId: PORTFOLIO_ID,
            bankId: BANK_ID,
            agency: "0002",
            accountNumber: "23456-7",
            createdAt: SECOND_DATE.toISOString(),
            updatedAt: SECOND_DATE.toISOString(),
          },
          {
            id: THIRD_ID,
            portfolioId: PORTFOLIO_ID,
            bankId: BANK_ID,
            agency: "0003",
            accountNumber: "34567-8",
            createdAt: THIRD_DATE.toISOString(),
            updatedAt: THIRD_DATE.toISOString(),
          },
        ])
      })

      it("should return the requested page when limit and offset are given", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            createdAt: FIRST_DATE,
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0002",
            accountNumber: "23456-7",
            createdAt: SECOND_DATE,
            id: buildEntityId(SECOND_ID),
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0003",
            accountNumber: "34567-8",
            createdAt: THIRD_DATE,
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBankAccountsUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          limit: 2,
          offset: 1,
        })

        expect(
          response.map((account) => account.agency)
        ).toStrictEqual(["0002", "0003"])
      })

      it("should return an empty list when no bank account is stored", async () => {
        const useCase = new ListBankAccountsUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({})

        expect(response).toStrictEqual([])
      })
    })
  })
})
