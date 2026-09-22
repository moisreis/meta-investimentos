import { ITransactionAllocation } from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { TransactionAllocationResponseDTO } from "../dto/transaction-allocation-response.dto"
import { toResponseDTO } from "../mappers/transaction-allocation.mapper"

export interface GetTransactionAllocationInput {
  transactionAllocationId: string
}

/**
 * @summary
 * Retrieves an existing `TransactionAllocation` by its
 * id.
 *
 * @remarks
 * Throws **NotFoundError** when no allocation matches
 * the provided id.
 *
 * @explanation
 * Use this use case to fetch a single allocation
 * through the service layer.
 *
 * @example
 * const ALLOCATION = await GET_TRANSACTION_ALLOCATION_USE_CASE
 *   .execute({
 *     transactionAllocationId: "allocation-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetTransactionAllocationUseCase {
  constructor(
    private transactionAllocationRepository: ITransactionAllocation
  ) {}

  /**
   * @summary
   * Fetches the allocation with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no allocation matches
   * the provided id.
   *
   * @explanation
   * Use this method to fetch a single allocation
   * through the service layer.
   *
   * @param input - Payload with the target allocation id.
   *
   * @returns The matching allocation.
   *
   * @example
   * const ALLOCATION = await GET_TRANSACTION_ALLOCATION_USE_CASE
   *   .execute({
   *     transactionAllocationId: "allocation-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetTransactionAllocationInput
  ): Promise<TransactionAllocationResponseDTO> {
    const ID = EntityId.create(input.transactionAllocationId)
    const ALLOCATION = await this.transactionAllocationRepository.findById(ID)
    if (!ALLOCATION) {
      throw new NotFoundError("`TransactionAllocation` not found.")
    }
    return toResponseDTO(ALLOCATION)
  }
}
