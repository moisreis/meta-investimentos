import type { EntityId, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `TransactionAllocation`.
 *
 * @remarks
 * Consumed quotas must be a positive value.
 *
 * @explanation
 * Use this DTO to allocate consumed quotas through the
 * service layer.
 *
 * @example
 * const DTO: CreateTransactionAllocationDTO = {
 *   applicationId: EntityId.create("application-1"),
 *   withdrawId: EntityId.create("withdrawal-1"),
 *   quotasConsumed: QuotaQuantity.create("250"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateTransactionAllocationDTO {
  applicationId: EntityId
  withdrawId: EntityId
  quotasConsumed: QuotaQuantity
}
