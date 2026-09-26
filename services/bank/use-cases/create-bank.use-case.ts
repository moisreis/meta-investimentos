import { Bank } from "@domain/bank/entities/bank.entity"
import { IBank } from "@domain/bank/interfaces/bank.interface"
import type { BankResponseDTO } from "../dto/bank-response.dto"
import {
  toCreateBankProps,
  toResponseDTO,
} from "../mappers/bank.mapper"

export interface CreateBankInput {
  code: string
  name: string
}

/**
 * @summary
 * Creates a new `Bank` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the bank with the bank repository.
 *
 * @explanation
 * Use this use case to register a new bank through
 * the service layer.
 *
 * @example
 * const BANK = await CREATE_BANK_USE_CASE.execute({
 *   code: "237",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateBankUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Creates and persists a new bank.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the bank with the bank repository.
   *
   * @explanation
   * Use this method to register a new bank through
   * the service layer.
   *
   * @param input - The bank creation payload.
   *
   * @returns The persisted bank.
   *
   * @example
   * const BANK = await CREATE_BANK_USE_CASE.execute({
   *   code: "237",
   *   name: "Banco Bradesco",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreateBankInput
  ): Promise<BankResponseDTO> {
    const PROPS = toCreateBankProps(input)
    const BANK = Bank.create(PROPS)
    const SAVED = await this.bankRepository.save(BANK)
    return toResponseDTO(SAVED)
  }
}
