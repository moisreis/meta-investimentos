import { IFund } from "@domain/fund/interfaces/fund.interface"
import type { FundResponseDTO } from "../dto/fund-response.dto"
import { toResponseDTO } from "../mappers/fund.mapper"

export interface ListFundsInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `Fund` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list funds through the service
 * layer.
 *
 * @example
 * const FUNDS = await LIST_FUNDS_USE_CASE.execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListFundsUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Fetches all funds, optionally paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list funds through the service
   * layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching funds.
   *
   * @example
   * const FUNDS = await LIST_FUNDS_USE_CASE.execute({});
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ListFundsInput): Promise<FundResponseDTO[]> {
    const FUNDS = await this.fundRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return FUNDS.map(toResponseDTO)
  }
}
