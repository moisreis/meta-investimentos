import { describe, it, expect, beforeEach } from "vitest"

import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import { ListAllQuotasUseCase } from "@/services/quota/use-cases/list-all-quotas.use-case"
import { createFakeQuotaRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuota,
} from "__tests__/__setup__/_factories.setup"

const FUND_ID = "00000000-0000-0000-0000-0000000000f1"
const OTHER_FUND_ID = "00000000-0000-0000-0000-0000000000f2"

describe("services/quota/use-cases/list-all-quotas.use-case", () => {
  let quotaRepository: IQuota

  beforeEach(() => {
    quotaRepository = createFakeQuotaRepository()
  })

  describe("execute", () => {
    it("should return an empty collection when no fund id is provided", async () => {
      let CALLED = false
      const NEVER_QUERIED: IQuota = {
        ...quotaRepository,
        async findAllByFundIds() {
          CALLED = true

          return []
        },
      }
      await quotaRepository.save(
        buildQuota({ fundId: buildEntityId(FUND_ID) })
      )
      const useCase = new ListAllQuotasUseCase(NEVER_QUERIED)

      const response = await useCase.execute({ fundIds: [] })

      expect(response).toEqual([])
      expect(CALLED).toBe(false)
    })

    it("should return the quotas of every requested fund", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(OTHER_FUND_ID),
          date: new Date("2026-01-16T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllQuotasUseCase(quotaRepository)

      const response = await useCase.execute({
        fundIds: [FUND_ID, OTHER_FUND_ID],
      })

      expect(response.length).toBe(2)
      expect(
        response.map((quota) => quota.fundId).sort()
      ).toEqual([FUND_ID, OTHER_FUND_ID].sort())
    })

    it("should skip the quotas of the funds outside the requested list", async () => {
      await quotaRepository.save(
        buildQuota({ fundId: buildEntityId(FUND_ID) })
      )
      await quotaRepository.save(
        buildQuota({ fundId: buildEntityId(OTHER_FUND_ID) })
      )
      const useCase = new ListAllQuotasUseCase(quotaRepository)

      const response = await useCase.execute({
        fundIds: [FUND_ID],
      })

      expect(response.length).toBe(1)
      expect(response[0].fundId).toBe(FUND_ID)
    })

    it("should order the quotas by date ascending", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(OTHER_FUND_ID),
          date: new Date("2026-03-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-02-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllQuotasUseCase(quotaRepository)

      const response = await useCase.execute({
        fundIds: [FUND_ID, OTHER_FUND_ID],
      })

      expect(response.map((quota) => quota.date)).toEqual([
        "2026-01-15T00:00:00.000Z",
        "2026-02-15T00:00:00.000Z",
        "2026-03-15T00:00:00.000Z",
      ])
    })

    it("should map every row to the response payload when listing quotas", async () => {
      const saved = await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllQuotasUseCase(quotaRepository)

      const response = await useCase.execute({
        fundIds: [FUND_ID],
      })

      expect(response[0]).toEqual({
        id: saved.id as string,
        fundId: FUND_ID,
        date: "2026-01-15T00:00:00.000Z",
        price: "10.5",
        createdAt: saved.createdAt.toISOString(),
      })
    })

    it("should return an empty collection when the requested funds hold no quota", async () => {
      const useCase = new ListAllQuotasUseCase(quotaRepository)

      const response = await useCase.execute({
        fundIds: [FUND_ID],
      })

      expect(response).toEqual([])
    })
  })
})
