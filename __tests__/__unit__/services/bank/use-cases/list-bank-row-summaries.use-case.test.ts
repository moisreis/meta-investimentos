import { describe, it, expect, beforeEach } from "vitest"

import { ListBankRowSummariesUseCase } from "@/services/bank/use-cases/list-bank-row-summaries.use-case"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_BANK_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_BANK_ID = "00000000-0000-0000-0000-000000000002"

describe("services/bank/use-cases/list-bank-row-summaries.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("ListBankRowSummariesUseCase", () => {
    describe("execute", () => {
      it("should tally the accounts of each bank when every bank has rows", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            bankId: buildEntityId(FIRST_BANK_ID),
            accountNumber: "11111-1",
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            bankId: buildEntityId(FIRST_BANK_ID),
            accountNumber: "22222-2",
          })
        )
        await bankAccountRepository.save(
          buildBankAccount({
            bankId: buildEntityId(SECOND_BANK_ID),
            accountNumber: "33333-3",
          })
        )
        const useCase = new ListBankRowSummariesUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankIds: [FIRST_BANK_ID, SECOND_BANK_ID],
        })

        expect(response).toStrictEqual([
          { bankId: FIRST_BANK_ID, accountCount: 2 },
          { bankId: SECOND_BANK_ID, accountCount: 1 },
        ])
      })

      it("should omit the banks without accounts when a bank has no rows", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            bankId: buildEntityId(FIRST_BANK_ID),
            accountNumber: "11111-1",
          })
        )
        const useCase = new ListBankRowSummariesUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankIds: [FIRST_BANK_ID, SECOND_BANK_ID],
        })

        expect(response).toStrictEqual([
          { bankId: FIRST_BANK_ID, accountCount: 1 },
        ])
      })

      it("should return an empty list when the bank id list is empty", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            bankId: buildEntityId(FIRST_BANK_ID),
          })
        )
        const useCase = new ListBankRowSummariesUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({ bankIds: [] })

        expect(response).toStrictEqual([])
      })
    })
  })
})
