import { Fund } from "@domain/fund/entities/fund.entity"
import { IFund } from "@domain/fund/interfaces/fund.interface"
import type { FundResponseDTO } from "../dto/fund-response.dto"
import {
  toCreateFundProps,
  toResponseDTO,
} from "../mappers/fund.mapper"

export interface CreateFundInput {
  cnpj: string
  name: string
  administrationFee?: string | null
  performanceFee?: string | null
  bankId: string
  benchmarkId?: string | null
  categoryId?: string | null
}

/**
 * @summary
 * Creates a new `Fund` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the fund with the fund repository.
 *
 * @explanation
 * Use this use case to register a new fund through
 * the service layer.
 *
 * @example
 * const FUND = await CREATE_FUND_USE_CASE.execute({
 *   cnpj: "12.345.678/0001-90",
 *   name: "Fundo Multi Mercado",
 *   administrationFee: "1.5",
 *   performanceFee: "20",
 *   bankId: "bank-1",
 *   benchmarkId: "benchmark-1",
 *   categoryId: "category-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateFundUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Creates and persists a new fund.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the fund with the fund repository.
   *
   * @explanation
   * Use this method to register a new fund through
   * the service layer.
   *
   * @param input - The fund creation payload.
   *
   * @returns The persisted fund.
   *
   * @example
   * const FUND = await CREATE_FUND_USE_CASE.execute({
   *   cnpj: "12.345.678/0001-90",
   *   name: "Fundo Multi Mercado",
   *   administrationFee: "1.5",
   *   performanceFee: "20",
   *   bankId: "bank-1",
   *   benchmarkId: "benchmark-1",
   *   categoryId: "category-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreateFundInput
  ): Promise<FundResponseDTO> {
    const PROPS = toCreateFundProps(input)
    const FUND = Fund.create(PROPS)
    const SAVED = await this.fundRepository.save(FUND)
    return toResponseDTO(SAVED)
  }
}
