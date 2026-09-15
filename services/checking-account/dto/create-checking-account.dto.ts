import type { EntityId, SignedMoney } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `CheckingAccount`.
 *
 * @remarks
 * The value may be positive or negative.
 *
 * @explanation
 * Use this DTO to create a checking account entry
 * through the service layer.
 *
 * @example
 * const DTO: CreateCheckingAccountDTO = {
 *   bankAccountId: EntityId.create("bank-account-1"),
 *   date: new Date("2026-01-01"),
 *   value: SignedMoney.create("1000"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateCheckingAccountDTO {
  bankAccountId: EntityId
  date: Date
  value: SignedMoney
}
