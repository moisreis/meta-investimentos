/**
 * @summary
 * Defines the payload for creating a `TransactionAllocation`.
 *
 * @remarks
 * Consumed quotas are a decimal string. Value objects
 * are built in the service mapper.
 *
 * @explanation
 * Use this DTO to allocate consumed quotas through the
 * service layer.
 *
 * @example
 * const DTO: CreateTransactionAllocationDTO = {
 *   applicationId: "application-1",
 *   withdrawId: "withdrawal-1",
 *   quotasConsumed: "250",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateTransactionAllocationDTO {
  applicationId: string
  withdrawId: string
  quotasConsumed: string
}
