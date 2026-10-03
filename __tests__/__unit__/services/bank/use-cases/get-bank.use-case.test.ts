import { describe, it, expect, beforeEach } from "vitest"

import { GetBankUseCase } from "@/services/bank/use-cases/get-bank.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")
const UPDATED_AT = new Date("2026-02-15T12:00:00.000Z")

describe("services/bank/use-cases/get-bank.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    bankRepository = createFakeBankRepository()
  })

  describe("GetBankUseCase", () => {
    describe("execute", () => {
      it("should return the full response when the bank exists", async () => {
        await bankRepository.save(
          buildBank({
            code: "237",
            name: "Banco Bradesco",
            createdAt: CREATED_AT,
            updatedAt: UPDATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new GetBankUseCase(bankRepository)

        const response = await useCase.execute({ bankId: ID })

        expect(response).toStrictEqual({
          id: ID,
          code: "237",
          name: "Banco Bradesco",
          createdAt: CREATED_AT.toISOString(),
          updatedAt: UPDATED_AT.toISOString(),
        })
      })

      it("should return only the requested bank when several banks exist", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(ID),
          })
        )
        await bankRepository.save(
          buildBank({
            code: "341",
            name: "Banco Itau",
            id: buildEntityId(OTHER_ID),
          })
        )
        const useCase = new GetBankUseCase(bankRepository)

        const response = await useCase.execute({
          bankId: OTHER_ID,
        })

        expect(response.id).toBe(OTHER_ID)
        expect(response.code).toBe("341")
        expect(response.name).toBe("Banco Itau")
      })

      it("should throw NotFoundError when the bank does not exist", async () => {
        await bankRepository.save(
          buildBank({ id: buildEntityId(OTHER_ID) })
        )
        const useCase = new GetBankUseCase(bankRepository)

        await expect(
          useCase.execute({ bankId: ID })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
