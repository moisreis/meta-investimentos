import { describe, it, expect, beforeEach } from "vitest"

import { GetQuotaUseCase } from "@/services/quota/use-cases/get-quota.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeQuotaRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuota,
  buildQuotaPrice,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const FUND_ID = "00000000-0000-0000-0000-0000000000f1"

describe("services/quota/use-cases/get-quota.use-case", () => {
  let quotaRepository: ReturnType<
    typeof createFakeQuotaRepository
  >

  beforeEach(() => {
    quotaRepository = createFakeQuotaRepository()
  })

  describe("execute", () => {
    it("should return the mapped quota when it exists", async () => {
      const saved = await quotaRepository.save(
        buildQuota({
          id: buildEntityId(ID),
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: buildQuotaPrice("1234.5678901"),
        })
      )
      const useCase = new GetQuotaUseCase(quotaRepository)

      const response = await useCase.execute({
        quotaId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.fundId).toBe(FUND_ID)
      expect(response.date).toBe("2026-01-15T00:00:00.000Z")
      expect(response.price).toBe("1234.56789")
      expect(response.createdAt).toBe(
        saved.createdAt.toISOString()
      )
    })

    it("should throw NotFoundError when the quota does not exist", async () => {
      const useCase = new GetQuotaUseCase(quotaRepository)

      await expect(
        useCase.execute({ quotaId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the quota id is blank", async () => {
      const useCase = new GetQuotaUseCase(quotaRepository)

      await expect(
        useCase.execute({ quotaId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
