import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateBankAccountUseCase } from "@/services/bank-account/use-cases/update-bank-account.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeBankAccountRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000010"
const BANK_ID = "00000000-0000-0000-0000-000000000020"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/bank-account/use-cases/update-bank-account.use-case", () => {
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

  describe("UpdateBankAccountUseCase", () => {
    describe("execute", () => {
      it("should persist the new agency and number when both are provided", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            portfolioId: buildEntityId(PORTFOLIO_ID),
            bankId: buildEntityId(BANK_ID),
            agency: "0001",
            accountNumber: "12345-6",
            createdAt: CREATED_AT,
            updatedAt: CREATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
          agency: "4321",
          accountNumber: "54321-6",
        })

        expect(response).toStrictEqual({
          id: ID,
          portfolioId: PORTFOLIO_ID,
          bankId: BANK_ID,
          agency: "4321",
          accountNumber: "54321-6",
          createdAt: CREATED_AT.toISOString(),
          updatedAt: getFixedDate().toISOString(),
        })

        const stored = await bankAccountRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.agency).toBe("4321")
        expect(stored?.accountNumber).toBe("54321-6")
      })

      it("should keep the account number when only the agency is provided", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
          agency: "4321",
        })

        expect(response.agency).toBe("4321")
        expect(response.accountNumber).toBe("12345-6")
      })

      it("should keep the agency when only the account number is provided", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
          accountNumber: "54321-6",
        })

        expect(response.agency).toBe("0001")
        expect(response.accountNumber).toBe("54321-6")
      })

      it("should persist the same values when no field is provided", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
        })

        expect(response.agency).toBe("0001")
        expect(response.accountNumber).toBe("12345-6")
        expect(
          await bankAccountRepository.findById(buildEntityId(ID))
        ).not.toBeNull()
      })

      it("should keep the stored values when the fields are null", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        const response = await useCase.execute({
          bankAccountId: ID,
          agency: null as unknown as string,
          accountNumber: null as unknown as string,
        })

        expect(response.agency).toBe("0001")
        expect(response.accountNumber).toBe("12345-6")
      })

      it("should throw NotFoundError when the bank account does not exist", async () => {
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            bankAccountId: ID,
            accountNumber: "54321-6",
          })
        ).rejects.toThrow(NotFoundError)
      })

      it("should throw ValidationError when the new agency is blank", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({ bankAccountId: ID, agency: "   " })
        ).rejects.toThrow(ValidationError)

        const stored = await bankAccountRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.agency).toBe("0001")
      })

      it("should throw ValidationError when the new account number is blank", async () => {
        await bankAccountRepository.save(
          buildBankAccount({
            agency: "0001",
            accountNumber: "12345-6",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankAccountUseCase(
          bankAccountRepository
        )

        await expect(
          useCase.execute({
            bankAccountId: ID,
            accountNumber: "   ",
          })
        ).rejects.toThrow(ValidationError)

        const stored = await bankAccountRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.accountNumber).toBe("12345-6")
      })
    })
  })
})
