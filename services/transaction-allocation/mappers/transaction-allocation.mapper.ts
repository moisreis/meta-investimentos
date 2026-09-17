import {
  TransactionAllocation,
  type TransactionAllocationProps,
} from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import { EntityId, QuotaQuantity } from "@/value-objects"
import type { CreateTransactionAllocationDTO } from "../dto/create-transaction-allocation.dto"
import type { TransactionAllocationResponseDTO } from "../dto/transaction-allocation-response.dto"

/**
 * @summary
 * Maps a create `TransactionAllocation` DTO into entity
 * props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `TransactionAllocation`.create.
 */
export function toCreateTransactionAllocationProps(
  dto: CreateTransactionAllocationDTO
): TransactionAllocationProps {
  return {
    applicationId: EntityId.create(dto.applicationId),
    withdrawId: EntityId.create(dto.withdrawId),
    quotasConsumed: QuotaQuantity.create(dto.quotasConsumed),
  }
}

/**
 * @summary
 * Maps a `TransactionAllocation` entity into a response
 * DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The allocation domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(
  entity: TransactionAllocation
): TransactionAllocationResponseDTO {
  return {
    id: entity.id as string,
    applicationId: entity.applicationId,
    withdrawId: entity.withdrawId,
    quotasConsumed: entity.quotasConsumed.value.toString(),
    createdAt: entity.createdAt.toISOString(),
  }
}
