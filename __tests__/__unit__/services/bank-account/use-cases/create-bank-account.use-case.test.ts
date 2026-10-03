import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateBankAccountUseCase } from "@/services/bank-account/use-cases/create-bank-account.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000010"
const BANK_ID = "00000000-0000-0000-0000-000000000020"
const ACCOUNT_ID = `${PORTFOLIO_ID}-0001-12345-6`

describe("services/bank-account/use-cases/create-bank-account.use-case", () => {
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    useFixedClock()
    bankAccountRepository = createFakeBankAccountRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("CreateBankAccountUseCase", () => {
    describe("execute", () => {
      it("should persist the bank account built from the payload", async () => {
        const useCase = new CreateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          portfolioId: PORTFOLIO_ID,
          bankId: BANK_ID,
          agency: "0001",
          accountNumber: "12345-6",
        })

        expect(response).toStrictEqual({
          id: ACCOUNT_ID,
          portfolioId: PORTFOLIO_ID,
          bankId: BANK_ID,
          agency: "0001",
          accountNumber: "12345-6",
          createdAt: getFixedDate().toISOString(),
          updatedAt: getFixedDate().toISOString(),
        })

        const stored = await bankAccountRepository.findById(
          buildEntityId(ACCOUNT_ID)
        )

        expect(stored).not.toBeNull()
        expect(stored?.agency).toBe("0001")
        expect(
          await bankAccountRepository.findAll({})
        ).toHaveLength(1)
      })

      it("should throw ValidationError when the portfolio id is blank", async () => {
        const useCase = new CreateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            portfolioId: "   ",
            bankId: BANK_ID,
            agency: "0001",
            accountNumber: "12345-6",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await bankAccountRepository.findAll({})
        ).toStrictEqual([])
      })

      it("should throw ValidationError when the bank id is blank", async () => {
        const useCase = new CreateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            portfolioId: PORTFOLIO_ID,
            bankId: "   ",
            agency: "0001",
            accountNumber: "12345-6",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await bankAccountRepository.findAll({})
        ).toStrictEqual([])
      })

      it("should throw ValidationError when the agency is blank", async () => {
        const useCase = new CreateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            portfolioId: PORTFOLIO_ID,
            bankId: BANK_ID,
            agency: "   ",
            accountNumber: "12345-6",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await bankAccountRepository.findAll({})
        ).toStrictEqual([])
      })

      it("should throw ValidationError when the account number is blank", async () => {
        const useCase = new CreateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            portfolioId: PORTFOLIO_ID,
            bankId: BANK_ID,
            agency: "0001",
            accountNumber: "   ",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await bankAccountRepository.findAll({})
        ).toStrictEqual([])
      })
    })
  })
})
