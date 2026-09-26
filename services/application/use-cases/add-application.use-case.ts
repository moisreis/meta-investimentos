import { calculateApplicationQuotas } from "@domain/application/calculators/application-quotas.calculator"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import { EntityId, PositiveMoney } from "@/value-objects"
import { NotFoundError } from "@errors/not-found.error"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import { CreateApplicationUseCase } from "./create-application.use-case"
import type { CreatePositionUseCase } from "@/services/position/use-cases/create-position.use-case"
import type { RedistributePositionAllocationUseCase } from "@/services/position/use-cases/redistribute-position-allocation.use-case"

// Share held by the position that opens a portfolio.
const FULL_ALLOCATION = "100"

export interface AddApplicationInput {
  portfolioId: string
  fundId: string
  date: string
  amount: string
}

/**
 * @summary
 * Records an application, opening its position when
 * the portfolio does not hold the fund yet.
 *
 * @remarks
 * Resolves the position of the fund inside the
 * portfolio and creates it through the create
 * position use case when it is missing. A new
 * position starts with the full 100% allocation and
 * the redistribute use case then splits the
 * portfolio evenly, so every position share changes
 * as new positions are created.
 *
 * The number of quotas is never provided by the
 * caller: the quota price of the application date
 * is loaded and the domain application quotas
 * calculator derives the quantity before the
 * application is created.
 *
 * @explanation
 * Use this use case to add an application to a
 * portfolio from the presentation layer. It owns
 * the whole flow so the server action stays a thin
 * adapter.
 *
 * @example
 * const APPLICATION = await ADD_APPLICATION_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   fundId: "fund-1",
 *   date: "2026-01-10",
 *   amount: "1000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class AddApplicationUseCase {
  constructor(
    private positionRepository: IPosition,
    private quotaRepository: IQuota,
    private createPositionUseCase: CreatePositionUseCase,
    private redistributePositionAllocationUseCase: RedistributePositionAllocationUseCase,
    private createApplicationUseCase: CreateApplicationUseCase
  ) {}

  /**
   * @summary
   * Adds the application to the portfolio.
   *
   * @remarks
   * Resolves the position of the fund inside the
   * portfolio and creates it through the create
   * position use case when it is missing. A new
   * position starts with the full 100% allocation and
   * the redistribute use case then splits the
   * portfolio evenly, so every position share changes
   * as new positions are created.
   *
   * @explanation
   * Use this method to add an application to a
   * portfolio. The quotas are always calculated by
   * the system from the quota price of the given
   * application date.
   *
   * @param input - Payload with the portfolio, the
   * fund, the application date and the amount.
   *
   * @returns The recorded application.
   *
   * @example
   * const APPLICATION = await ADD_APPLICATION_USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   *   fundId: "fund-1",
   *   date: "2026-01-10",
   *   amount: "1000",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: AddApplicationInput
  ): Promise<ApplicationResponseDTO> {
    const POSITION_ID = await this.resolvePositionId(input)
    const QUOTAS = await this.resolveQuotas(input)

    return this.createApplicationUseCase.execute({
      positionId: POSITION_ID,
      date: input.date,
      amount: input.amount,
      quotas: QUOTAS,
    })
  }

  // Returns the position id, creating the position
  // and redistributing the allocations when missing.
  private async resolvePositionId(
    input: AddApplicationInput
  ): Promise<string> {
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const FUND_ID = EntityId.create(input.fundId)

    const EXISTING =
      await this.positionRepository.findByPortfolioIdAndFundId(
        PORTFOLIO_ID,
        FUND_ID
      )

    if (EXISTING?.id) return EXISTING.id

    const CREATED = await this.createPositionUseCase.execute({
      portfolioId: input.portfolioId,
      fundId: input.fundId,
      initialBalance: null,
      initialBalanceDate: null,
      allocation: FULL_ALLOCATION,
    })

    await this.redistributePositionAllocationUseCase.execute({
      portfolioId: input.portfolioId,
    })

    return CREATED.id
  }

  // Derives the quotas from the quota price of the
  // application date. The amount alone is never
  // enough: without a quota price the application
  // cannot be valued.
  private async resolveQuotas(
    input: AddApplicationInput
  ): Promise<string> {
    const QUOTA = await this.quotaRepository.findByFundIdAndDate(
      EntityId.create(input.fundId),
      new Date(input.date)
    )

    if (!QUOTA) {
      throw new NotFoundError(
        "`Quota` not found for the application date."
      )
    }

    const QUOTAS = calculateApplicationQuotas({
      application: PositiveMoney.create(input.amount),
      quota: QUOTA.price,
    })

    return QUOTAS.value.toString()
  }
}
