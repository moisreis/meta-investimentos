import { describe, it, expect, beforeEach } from "vitest"

import { ListFundRowSummariesUseCase } from "@/services/fund/use-cases/list-fund-row-summaries.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"

const FUND_A = "fund-1"
const FUND_B = "fund-2"
const PORTFOLIO = "portfolio-1"
const OTHER_PORTFOLIO = "portfolio-2"

describe("services/fund/use-cases/list-fund-row-summaries.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
  })

  describe("execute", () => {
    it("should return an empty array when the fund id list is empty", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(PORTFOLIO),
          fundId: buildEntityId(FUND_A),
        })
      )
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      const response = await useCase.execute({ fundIds: [] })

      expect(response).toStrictEqual([])
    })

    it("should count the positions of each fund when listing row summaries", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(PORTFOLIO),
          fundId: buildEntityId(FUND_A),
        })
      )
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(OTHER_PORTFOLIO),
          fundId: buildEntityId(FUND_A),
        })
      )
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        fundIds: [FUND_A],
      })

      expect(response).toStrictEqual([
        { fundId: FUND_A, positionCount: 2 },
      ])
    })

    it("should tally several funds when listing row summaries", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(PORTFOLIO),
          fundId: buildEntityId(FUND_A),
        })
      )
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(PORTFOLIO),
          fundId: buildEntityId(FUND_B),
        })
      )
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        fundIds: [FUND_A, FUND_B],
      })

      expect(response).toStrictEqual([
        { fundId: FUND_A, positionCount: 1 },
        { fundId: FUND_B, positionCount: 1 },
      ])
    })

    it("should omit funds without positions when listing row summaries", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(PORTFOLIO),
          fundId: buildEntityId(FUND_A),
        })
      )
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        fundIds: [FUND_A, FUND_B],
      })

      expect(
        response.map((entry) => entry.fundId)
      ).toStrictEqual([FUND_A])
    })

    it("should return an empty array when no position matches", async () => {
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        fundIds: [FUND_A, FUND_B],
      })

      expect(response).toStrictEqual([])
    })

    it("should throw ValidationError when a fund id is blank", async () => {
      const useCase = new ListFundRowSummariesUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({ fundIds: ["   "] })
      ).rejects.toThrow(ValidationError)
    })
  })
})
