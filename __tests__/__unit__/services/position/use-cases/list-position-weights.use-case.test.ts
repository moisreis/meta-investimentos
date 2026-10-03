import { describe, it, expect, beforeEach } from "vitest"

import { ListPositionWeightsUseCase } from "@/services/position/use-cases/list-position-weights.use-case"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import {
  createFakeApplicationRepository,
  createFakePositionRepository,
  createFakeWithdrawalRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
  buildPositiveMoney,
  buildPosition,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

const PORTFOLIO_ID = "00000000-0000-0000-0000-0000000000a1"
const OTHER_PORTFOLIO = "00000000-0000-0000-0000-0000000000a2"
const FIRST_POSITION = "00000000-0000-0000-0000-0000000000b1"
const SECOND_POSITION = "00000000-0000-0000-0000-0000000000b2"

describe("services/position/use-cases/list-position-weights.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
    applicationRepository = createFakeApplicationRepository()
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  describe("execute", () => {
    it("should return an empty collection when no portfolio is provided", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })

    it("should return an empty collection when the portfolios hold no position", async () => {
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response).toEqual([])
    })

    it("should report the share of each position when the balances differ", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("90000.00"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(SECOND_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-2"),
          initialBalance: buildPositiveMoney("10000.00"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response.length).toBe(2)
      expect(response[0]).toEqual({
        positionId: FIRST_POSITION,
        portfolioId: PORTFOLIO_ID,
        fundId: "fund-1",
        weight: "90",
        investedValue: "90000",
      })
      expect(response[1].weight).toBe("10")
      expect(response[1].investedValue).toBe("10000")
    })

    it("should add the active movements to the initial balance when computing the invested value", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("1000.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId(FIRST_POSITION),
          amount: buildPositiveMoney("500.00"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          positionId: buildEntityId(FIRST_POSITION),
          amount: buildPositiveMoney("200.00"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response[0].investedValue).toBe("1300")
      expect(response[0].weight).toBe("100")
    })

    it("should ignore the reversed movements when computing the invested value", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("1000.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: buildPositiveMoney("900.00"),
          reversedAt: new Date("2026-02-01T00:00:00.000Z"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: buildPositiveMoney("700.00"),
          reversedAt: new Date("2026-02-01T00:00:00.000Z"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response[0].investedValue).toBe("1500")
    })

    it("should report a zero share when the portfolio holds no money", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: null,
          initialBalanceDate: null,
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(SECOND_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-2"),
          initialBalance: null,
          initialBalanceDate: null,
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response.map((weight) => weight.weight)).toEqual([
        "0",
        "0",
      ])
      expect(
        response.map((weight) => weight.investedValue)
      ).toEqual(["0", "0"])
    })

    it("should report a zero share when the portfolio balance is negative", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: null,
          initialBalanceDate: null,
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          positionId: buildEntityId(FIRST_POSITION),
          amount: buildPositiveMoney("500.00"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response[0].weight).toBe("0")
      expect(response[0].investedValue).toBe("-500")
    })

    it("should sum the balances per portfolio when several portfolios are listed", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(FIRST_POSITION),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("3000.00"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(SECOND_POSITION),
          portfolioId: buildEntityId(OTHER_PORTFOLIO),
          fundId: buildEntityId("fund-2"),
          initialBalance: buildPositiveMoney("500.00"),
        })
      )
      const useCase = new ListPositionWeightsUseCase(
        positionRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID, OTHER_PORTFOLIO],
      })

      expect(response.length).toBe(2)
      expect(response.map((weight) => weight.weight)).toEqual([
        "100",
        "100",
      ])
      expect(response[1].portfolioId).toBe(OTHER_PORTFOLIO)
    })

    it("should skip the positions that were never persisted when reading the balances", async () => {
      const UNPERSISTED = buildPosition({
        portfolioId: buildEntityId(PORTFOLIO_ID),
        fundId: buildEntityId("fund-1"),
        initialBalance: buildPositiveMoney("90000.00"),
      })
      const READ_ONLY: IPosition = {
        ...positionRepository,
        async findAllByPortfolioIds() {
          return [UNPERSISTED]
        },
      }
      const useCase = new ListPositionWeightsUseCase(
        READ_ONLY,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        portfolioIds: [PORTFOLIO_ID],
      })

      expect(response).toEqual([])
    })
  })
})
