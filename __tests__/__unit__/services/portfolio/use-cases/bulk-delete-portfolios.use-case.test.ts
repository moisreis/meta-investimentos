import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeletePortfoliosUseCase } from "@/services/portfolio/use-cases/bulk-delete-portfolios.use-case"
import { createFakePortfolioRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"

const FIRST = "00000000-0000-0000-0000-000000000004"
const SECOND = "00000000-0000-0000-0000-000000000005"
const FOREIGN = "00000000-0000-0000-0000-000000000006"

describe("services/portfolio/use-cases/bulk-delete-portfolios.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >

  beforeEach(() => {
    portfolioRepository = createFakePortfolioRepository()
  })

  describe("execute", () => {
    it("should remove every owned portfolio when the user owns them all", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FIRST),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(SECOND),
          acronym: "FII",
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({
        portfolioIds: [FIRST, SECOND],
        userId: "user-1",
      })

      expect(
        await portfolioRepository.findById(buildEntityId(FIRST))
      ).toBeNull()
      expect(
        await portfolioRepository.findById(buildEntityId(SECOND))
      ).toBeNull()
    })

    it("should keep the portfolios of another user when a user id is provided", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FIRST),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FOREIGN),
          acronym: "FII",
          userId: buildEntityId("user-2"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({
        portfolioIds: [FIRST, FOREIGN],
        userId: "user-1",
      })

      expect(
        await portfolioRepository.findById(buildEntityId(FIRST))
      ).toBeNull()
      expect(
        await portfolioRepository.findById(
          buildEntityId(FOREIGN)
        )
      ).not.toBeNull()
    })

    it("should remove portfolios of any owner when no user id is provided", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FIRST),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FOREIGN),
          acronym: "FII",
          userId: buildEntityId("user-2"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({ portfolioIds: [FIRST, FOREIGN] })

      expect(
        await portfolioRepository.findById(buildEntityId(FIRST))
      ).toBeNull()
      expect(
        await portfolioRepository.findById(
          buildEntityId(FOREIGN)
        )
      ).toBeNull()
    })

    it("should keep every row when the portfolio id list is empty", async () => {
      const kept = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FIRST),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({ portfolioIds: [] })

      expect(
        await portfolioRepository.findById(kept.id!)
      ).not.toBeNull()
    })

    it("should keep every row when no requested portfolio is owned", async () => {
      const kept = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FOREIGN),
          userId: buildEntityId("user-2"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({
        portfolioIds: [FIRST, kept.id!],
        userId: "user-1",
      })

      expect(
        await portfolioRepository.findById(kept.id!)
      ).not.toBeNull()
    })

    it("should ignore ids that no longer exist when deleting in bulk", async () => {
      const target = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FIRST),
          userId: buildEntityId("user-1"),
        })
      )
      const untouched = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(FOREIGN),
          acronym: "FII",
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new BulkDeletePortfoliosUseCase(
        portfolioRepository
      )

      await useCase.execute({
        portfolioIds: [SECOND, target.id!],
      })

      expect(
        await portfolioRepository.findById(target.id!)
      ).toBeNull()
      expect(
        await portfolioRepository.findById(untouched.id!)
      ).not.toBeNull()
    })
  })
})
