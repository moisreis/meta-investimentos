import {
  ITransactionAllocation,
} from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import { EntityId } from "@/value-objects"
import type { TransactionAllocationResponseDTO } from "../dto/transaction-allocation-response.dto"
import { toResponseDTO } from "../mappers/transaction-allocation.mapper"

export interface ListTransactionAllocationsInput {
  withdrawalId: string
}

/**
 * @summary
 * Lists all `TransactionAllocation` entries of a
 * withdrawal.
 *
 * @remarks
 * Uses the withdrawal id to scope the allocation query.
 *
 * @explanation
 * Use this use case to list the allocations of a given
 * withdrawal through the service layer.
 *
 * @example
 * const ALLOCATIONS = await LIST_TRANSACTION_ALLOCATIONS_USE_CASE.execute({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListTransactionAllocationsUseCase {
  constructor(
    private transactionAllocationRepository: ITransactionAllocation
  ) {}

  /**
   * @summary
   * Fetches all allocations of the provided withdrawal.
   *
   * @param input - Payload with the target withdrawal id.
   * @returns The matching allocation responses.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListTransactionAllocationsInput
  ): Promise<TransactionAllocationResponseDTO[]> {
    const WITHDRAW_ID = EntityId.create(input.withdrawalId)
    const ALLOCATIONS =
      await this.transactionAllocationRepository.findAllByWithdrawalId(
        WITHDRAW_ID
      )
    return ALLOCATIONS.map(toResponseDTO)
  }
}