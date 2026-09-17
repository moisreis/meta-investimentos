import { IBank } from "@domain/bank/interfaces/bank.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BankResponseDTO } from "../dto/bank-response.dto"
import { toResponseDTO } from "../mappers/bank.mapper"

export interface GetBankInput {
  bankId: string
}

/**
 * @summary
 * Retrieves an existing `Bank` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no bank matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single bank through
 * the service layer.
 *
 * @example
 * const BANK = await GET_BANK_USE_CASE.execute({
 *   bankId: "bank-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetBankUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Fetches the bank with the provided id.
   *
   * @param input - Payload with the target bank id.
   * @returns The matching bank response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetBankInput): Promise<BankResponseDTO> {
    const ID = EntityId.create(input.bankId)
    const BANK = await this.bankRepository.findById(ID)
    if (!BANK) {
      throw new NotFoundError("`Bank` not found.")
    }
    return toResponseDTO(BANK)
  }
}