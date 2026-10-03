import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { AddWithdrawalUseCase } from "@/services/withdrawal/use-cases/add-withdrawal.use-case"
import { CreateWithdrawalUseCase } from "@/services/withdrawal/use-cases/create-withdrawal.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakePositionRepository,
  createFakeQuotaRepository,
  createFakeWithdrawalRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
  buildQuota,
  buildQuotaPrice,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const POSITION_ID = "position-1"
const FUND_ID = "fund-1"
const DATE = "2026-02-15"

describe("services/withdrawal/use-cases/add-withdrawal.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let quotaRepository: ReturnType<
    typeof createFakeQuotaRepository
  >

  beforeEach(() => {
    useFixedClock()
    withdrawalRepository = createFakeWithdrawalRepository()
    positionRepository = createFakePositionRepository()
    quotaRepository = createFakeQuotaRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  // Wires the real collaborator use case on top of the
  // fake repositories, so the only mocked boundary is
  // persistence.
  const buildUseCase = (): AddWithdrawalUseCase =>
    new AddWithdrawalUseCase(
      positionRepository,
      quotaRepository,
      new CreateWithdrawalUseCase(
        withdrawalRepository,
        positionRepository
      )
    )

  describe("execute", () => {
    it("should derive the quotas from the quota price of the withdrawal date", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          fundId: buildEntityId(FUND_ID),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "1000",
      })

      expect(response.quotas).toBe("95.238095")
      expect(response.amount).toBe("1000")
      expect(response.positionId).toBe(POSITION_ID)
      expect(response.date).toBe("2026-02-15T00:00:00.000Z")
    })

    it("should persist the withdrawal with the derived quotas", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          fundId: buildEntityId(FUND_ID),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "1050.00",
      })

      const stored =
        await withdrawalRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(1)
      expect(stored[0].quotas.value.toString()).toBe("100")
      expect(stored[0].amount.value.toString()).toBe("1050")
    })

    it("should look the quota price up by the fund of the position", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          fundId: buildEntityId(FUND_ID),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-9"),
          date: new Date(DATE),
          price: buildQuotaPrice("2.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "1050.00",
      })

      expect(response.quotas).toBe("100")
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "1000",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when no quota price exists for the withdrawal date", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          fundId: buildEntityId(FUND_ID),
        })
      )
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "1000",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not persist a withdrawal when no quota price exists for the withdrawal date", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          fundId: buildEntityId(FUND_ID),
        })
      )
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "1000",
        })
      ).rejects.toThrow(NotFoundError)

      const stored =
        await withdrawalRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(0)
    })
  })
})
