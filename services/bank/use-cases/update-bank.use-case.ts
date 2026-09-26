import { IBank } from "@domain/bank/interfaces/bank.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BankResponseDTO } from "../dto/bank-response.dto"
import { toResponseDTO } from "../mappers/bank.mapper"

export interface UpdateBankInput {
  bankId: string
  code?: string
  name?: string
}

/**
 * @summary
 * Updates an existing `Bank`.
 *
 * @remarks
 * Fetches the bank, applies `rename` and `changeCode`
 * for the provided fields, and persists the updated
 * entity.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing bank through the service layer.
 *
 * @example
 * const BANK = await UPDATE_BANK_USE_CASE.execute({
 *   bankId: "bank-1",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateBankUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Updates and persists a bank.
   *
   * @remarks
   * Fetches the bank, applies `rename` and `changeCode`
   * for the provided fields, and persists the updated
   * entity.
   *
   * @explanation
   * Use this method to edit the editable fields of an
   * existing bank through the service layer.
   *
   * @param input - Payload with the target bank id and
   *                field updates.
   *
   * @returns The updated bank.
   *
   * @example
   * const BANK = await UPDATE_BANK_USE_CASE.execute({
   *   bankId: "bank-1",
   *   name: "Banco Bradesco",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: UpdateBankInput
  ): Promise<BankResponseDTO> {
    const ID = EntityId.create(input.bankId)
    const BANK = await this.bankRepository.findById(ID)
    if (!BANK) {
      throw new NotFoundError("`Bank` not found.")
    }
    let UPDATED = BANK
    if (input.name !== undefined) {
      UPDATED = UPDATED.rename(input.name)
    }
    if (input.code !== undefined) {
      UPDATED = UPDATED.changeCode(input.code)
    }
    const SAVED = await this.bankRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
