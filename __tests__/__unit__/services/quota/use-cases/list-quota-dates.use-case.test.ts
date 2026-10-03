import { describe, it, expect, beforeEach } from "vitest"

import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import { ListQuotaDatesUseCase } from "@/services/quota/use-cases/list-quota-dates.use-case"
import { createFakeQuotaRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuota,
} from "__tests__/__setup__/_factories.setup"

const FUND_ID = "00000000-0000-0000-0000-0000000000f1"
const OTHER_FUND_ID = "00000000-0000-0000-0000-0000000000f2"

describe("services/quota/use-cases/list-quota-dates.use-case", () => {
  let quotaRepository: IQuota

  beforeEach(() => {
    quotaRepository = createFakeQuotaRepository()
  })

  describe("execute", () => {
    it("should return the quota dates of the fund ordered ascending", async () => {
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
      const useCase = new ListQuotaDatesUseCase(quotaRepository)

      const response = await useCase.execute(FUND_ID)

      expect(response).toEqual(["2026-01-15", "2026-02-15"])
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
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListQuotaDatesUseCase(quotaRepository)

      const response = await useCase.execute(FUND_ID)

      expect(response).toEqual(["2026-01-15"])
    })

    it("should query the repository with the provided fund id when reading dates", async () => {
      let QUERIED: string | null = null
      const SPY: IQuota = {
        ...quotaRepository,
        async findAllDatesByFundId(fundId) {
          QUERIED = fundId

          return []
        },
      }
      const useCase = new ListQuotaDatesUseCase(SPY)

      await useCase.execute(FUND_ID)

      expect(QUERIED).toBe(FUND_ID)
    })

    it("should return an empty collection when the fund holds no quota", async () => {
      const useCase = new ListQuotaDatesUseCase(quotaRepository)

      const response = await useCase.execute(FUND_ID)

      expect(response).toEqual([])
    })

    it("should return every distinct date of the fund", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-03-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListQuotaDatesUseCase(quotaRepository)

      const response = await useCase.execute(FUND_ID)

      expect(response).toEqual(["2026-01-15", "2026-03-15"])
      expect(
        response.every((date) =>
          /^\d{4}-\d{2}-\d{2}$/.test(date)
        )
      ).toBe(true)
    })
  })
})
