import { describe, it, expect, beforeEach } from "vitest"

import { ListQuotasUseCase } from "@/services/quota/use-cases/list-quotas.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeQuotaRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuota,
} from "__tests__/__setup__/_factories.setup"

const FUND_ID = "00000000-0000-0000-0000-0000000000f1"
const OTHER_FUND_ID = "00000000-0000-0000-0000-0000000000f2"

describe("services/quota/use-cases/list-quotas.use-case", () => {
  let quotaRepository: ReturnType<
    typeof createFakeQuotaRepository
  >

  beforeEach(() => {
    quotaRepository = createFakeQuotaRepository()
  })

  describe("execute", () => {
    it("should return the quotas of the fund ordered by date ascending", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-02-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListQuotasUseCase(quotaRepository)

      const response = await useCase.execute({ fundId: FUND_ID })

      expect(response.map((quota) => quota.date)).toEqual([
        "2026-01-15T00:00:00.000Z",
        "2026-02-15T00:00:00.000Z",
      ])
    })

    it("should skip the quotas of the other funds", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(OTHER_FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListQuotasUseCase(quotaRepository)

      const response = await useCase.execute({ fundId: FUND_ID })

      expect(response.length).toBe(1)
      expect(response[0].fundId).toBe(FUND_ID)
    })

    it("should map every row to the response payload when listing quotas", async () => {
      const saved = await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListQuotasUseCase(quotaRepository)

      const response = await useCase.execute({ fundId: FUND_ID })

      expect(response[0]).toEqual({
        id: saved.id as string,
        fundId: FUND_ID,
        date: "2026-01-15T00:00:00.000Z",
        price: "10.5",
        createdAt: saved.createdAt.toISOString(),
      })
    })

    it("should return an empty collection when the fund holds no quota", async () => {
      const useCase = new ListQuotasUseCase(quotaRepository)

      const response = await useCase.execute({ fundId: FUND_ID })

      expect(response).toEqual([])
    })

    it("should throw ValidationError when the fund id is blank", async () => {
      const useCase = new ListQuotasUseCase(quotaRepository)

      await expect(
        useCase.execute({ fundId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
