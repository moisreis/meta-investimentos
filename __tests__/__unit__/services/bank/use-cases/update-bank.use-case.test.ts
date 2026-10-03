import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateBankUseCase } from "@/services/bank/use-cases/update-bank.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/bank/use-cases/update-bank.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    useFixedClock()
    bankRepository = createFakeBankRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("UpdateBankUseCase", () => {
    describe("execute", () => {
      it("should persist the new code and name when both are provided", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            createdAt: CREATED_AT,
            updatedAt: CREATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        const response = await useCase.execute({
          bankId: ID,
          code: "237",
          name: "Banco Bradesco",
        })

        expect(response).toStrictEqual({
          id: ID,
          code: "237",
          name: "Banco Bradesco",
          createdAt: CREATED_AT.toISOString(),
          updatedAt: getFixedDate().toISOString(),
        })

        const stored = await bankRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.code).toBe("237")
        expect(stored?.name).toBe("Banco Bradesco")
      })

      it("should keep the code when only the name is provided", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        const response = await useCase.execute({
          bankId: ID,
          name: "Banco do Brasil S.A.",
        })

        expect(response.code).toBe("001")
        expect(response.name).toBe("Banco do Brasil S.A.")
      })

      it("should keep the name when only the code is provided", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        const response = await useCase.execute({
          bankId: ID,
          code: "341",
        })

        expect(response.code).toBe("341")
        expect(response.name).toBe("Banco do Brasil")
      })

      it("should persist the same values when no field is provided", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        const response = await useCase.execute({ bankId: ID })

        expect(response.code).toBe("001")
        expect(response.name).toBe("Banco do Brasil")
        expect(
          await bankRepository.findById(buildEntityId(ID))
        ).not.toBeNull()
      })

      it("should throw NotFoundError when the bank does not exist", async () => {
        const useCase = new UpdateBankUseCase(bankRepository)

        await expect(
          useCase.execute({ bankId: ID, name: "Banco Bradesco" })
        ).rejects.toThrow(NotFoundError)
      })

      it("should throw ValidationError when the new name is blank", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        await expect(
          useCase.execute({ bankId: ID, name: "   " })
        ).rejects.toThrow(ValidationError)

        const stored = await bankRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.name).toBe("Banco do Brasil")
      })

      it("should throw ValidationError when the new code is blank", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBankUseCase(bankRepository)

        await expect(
          useCase.execute({ bankId: ID, code: "   " })
        ).rejects.toThrow(ValidationError)

        const stored = await bankRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.code).toBe("001")
      })
    })
  })
})
