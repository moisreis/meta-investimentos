import { describe, it, expect, beforeEach } from "vitest"

import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const THIRD_ID = "00000000-0000-0000-0000-000000000003"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/bank/use-cases/list-banks.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    bankRepository = createFakeBankRepository()
  })

  describe("ListBanksUseCase", () => {
    describe("execute", () => {
      it("should return the banks in ascending code order when no pagination is given", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            createdAt: CREATED_AT,
            updatedAt: CREATED_AT,
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankRepository.save(
          buildBank({
            code: "237",
            name: "Banco Bradesco",
            createdAt: CREATED_AT,
            updatedAt: CREATED_AT,
            id: buildEntityId(SECOND_ID),
          })
        )
        await bankRepository.save(
          buildBank({
            code: "341",
            name: "Banco Itau",
            createdAt: CREATED_AT,
            updatedAt: CREATED_AT,
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBanksUseCase(bankRepository)

        const response = await useCase.execute({})

        expect(response).toStrictEqual([
          {
            id: FIRST_ID,
            code: "001",
            name: "Banco do Brasil",
            createdAt: CREATED_AT.toISOString(),
            updatedAt: CREATED_AT.toISOString(),
          },
          {
            id: SECOND_ID,
            code: "237",
            name: "Banco Bradesco",
            createdAt: CREATED_AT.toISOString(),
            updatedAt: CREATED_AT.toISOString(),
          },
          {
            id: THIRD_ID,
            code: "341",
            name: "Banco Itau",
            createdAt: CREATED_AT.toISOString(),
            updatedAt: CREATED_AT.toISOString(),
          },
        ])
      })

      it("should return the requested page when limit and offset are given", async () => {
        await bankRepository.save(
          buildBank({
            code: "001",
            name: "Banco do Brasil",
            id: buildEntityId(FIRST_ID),
          })
        )
        await bankRepository.save(
          buildBank({
            code: "237",
            name: "Banco Bradesco",
            id: buildEntityId(SECOND_ID),
          })
        )
        await bankRepository.save(
          buildBank({
            code: "341",
            name: "Banco Itau",
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBanksUseCase(bankRepository)

        const response = await useCase.execute({
          limit: 2,
          offset: 1,
        })

        expect(response.map((bank) => bank.code)).toStrictEqual([
          "237",
          "341",
        ])
      })

      it("should return an empty list when no bank is stored", async () => {
        const useCase = new ListBanksUseCase(bankRepository)

        const response = await useCase.execute({})

        expect(response).toStrictEqual([])
      })
    })
  })
})
