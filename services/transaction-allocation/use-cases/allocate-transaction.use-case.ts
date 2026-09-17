import {
  TransactionAllocation,
} from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import {
  ITransactionAllocation,
} from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import { NotFoundError } from "@errors/not-found.error"
import { IApplication } from "@domain/application/interfaces/application.interface"
import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { EntityId } from "@/value-objects"
import type { TransactionAllocationResponseDTO } from "../dto/transaction-allocation-response.dto"
import {
  toCreateTransactionAllocationProps,
  toResponseDTO,
} from "../mappers/transaction-allocation.mapper"

export interface AllocateTransactionInput {
  applicationId: string
  withdrawId: string
  quotasConsumed: string
}

/**
 * @summary
 * Records a `TransactionAllocation` and persists it.
 *
 * @remarks
 * Verifies the application and the withdrawal exist,
 * then builds the allocation via the create mapper and
 * saves it with the allocation repository.
 *
 * @explanation
 * Use this use case to record quota consumption between
 * an application and a withdrawal through the service
 * layer.
 *
 * @example
 * const ALLOCATION = await ALLOCATE_TRANSACTION_USE_CASE.execute({
 *   applicationId: "application-1",
 *   withdrawId: "withdrawal-1",
 *   quotasConsumed: "250",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class AllocateTransactionUseCase {
  constructor(
    private transactionAllocationRepository: ITransactionAllocation,
    private applicationRepository: IApplication,
    private withdrawalRepository: IWithdrawal
  ) {}

  /**
   * @summary
   * Records and persists the transaction allocation.
   *
   * @param input - The allocation payload.
   * @returns The persisted allocation response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: AllocateTransactionInput
  ): Promise<TransactionAllocationResponseDTO> {
    const APPLICATION_ID = EntityId.create(input.applicationId)
    const WITHDRAW_ID = EntityId.create(input.withdrawId)
    const APPLICATION = await this.applicationRepository.findById(
      APPLICATION_ID
    )
    if (!APPLICATION) {
      throw new NotFoundError("`Application` not found.")
    }
    const WITHDRAWAL = await this.withdrawalRepository.findById(WITHDRAW_ID)
    if (!WITHDRAWAL) {
      throw new NotFoundError("`Withdrawal` not found.")
    }
    const PROPS = toCreateTransactionAllocationProps(input)
    const ALLOCATION = TransactionAllocation.create(PROPS)
    const SAVED = await this.transactionAllocationRepository.save(ALLOCATION)
    return toResponseDTO(SAVED)
  }
}