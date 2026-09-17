import { IFund } from "@domain/fund/interfaces/fund.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { FundResponseDTO } from "../dto/fund-response.dto"
import { toResponseDTO } from "../mappers/fund.mapper"

export interface GetFundInput {
  fundId: string
}

/**
 * @summary
 * Retrieves an existing `Fund` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no fund matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single fund through
 * the service layer.
 *
 * @example
 * const FUND = await GET_FUND_USE_CASE.execute({
 *   fundId: "fund-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetFundUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Fetches the fund with the provided id.
   *
   * @param input - Payload with the target fund id.
   * @returns The matching fund response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetFundInput): Promise<FundResponseDTO> {
    const ID = EntityId.create(input.fundId)
    const FUND = await this.fundRepository.findById(ID)
    if (!FUND) {
      throw new NotFoundError("`Fund` not found.")
    }
    return toResponseDTO(FUND)
  }
}