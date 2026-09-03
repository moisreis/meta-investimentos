import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a withdrawal.
 */
export interface WithdrawalDto {
  id: EntityId;
  positionId: EntityId;
  date: Date;
  amount: string;
  quotas: string;
  reversedAt: Date | null;
  reversedByUserId: EntityId | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a transaction allocation.
 */
export interface TransactionAllocationDto {
  id: EntityId;
  applicationId: EntityId;
  withdrawId: EntityId;
  quotasConsumed: string;
  createdAt: Date;
}

/**
 * Maps a `Withdrawal` entity to its public DTO representation.
 *
 * @param withdrawal - The withdrawal entity.
 * @returns The withdrawal DTO.
 */
export function toWithdrawalDto(withdrawal: Withdrawal): WithdrawalDto {
  return {
    id: withdrawal.id as EntityId,
    positionId: withdrawal.positionId,
    date: withdrawal.date,
    amount: withdrawal.amount.value.toString(),
    quotas: withdrawal.quotas.value.toString(),
    reversedAt: withdrawal.reversedAt,
    reversedByUserId: withdrawal.reversedByUserId,
    createdAt: withdrawal.createdAt,
    updatedAt: withdrawal.updatedAt,
  };
}

/**
 * Maps a `TransactionAllocation` entity to its public DTO
 * representation.
 *
 * @param allocation - The transaction allocation entity.
 * @returns The transaction allocation DTO.
 */
export function toTransactionAllocationDto(
  allocation: TransactionAllocation,
): TransactionAllocationDto {
  return {
    id: allocation.id as EntityId,
    applicationId: allocation.applicationId,
    withdrawId: allocation.withdrawId,
    quotasConsumed: allocation.quotasConsumed.value.toString(),
    createdAt: allocation.createdAt,
  };
}
