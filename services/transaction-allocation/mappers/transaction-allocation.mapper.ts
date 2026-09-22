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
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity creation props.
 *
 * @example
 * const PROPS = toCreateTransactionAllocationProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The allocation domain entity.
 *
 * @returns The response payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
