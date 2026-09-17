import { IBank } from "@domain/bank/interfaces/bank.interface"
import type { BankResponseDTO } from "../dto/bank-response.dto"
import { toResponseDTO } from "../mappers/bank.mapper"

export interface ListBanksInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `Bank` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list banks through the service
 * layer.
 *
 * @example
 * const BANKS = await LIST_BANKS_USE_CASE.execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListBanksUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Fetches all banks, optionally paginated.
   *
   * @param input - Pagination options.
   * @returns The matching bank responses.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ListBanksInput): Promise<BankResponseDTO[]> {
    const BANKS = await this.bankRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return BANKS.map(toResponseDTO)
  }
}