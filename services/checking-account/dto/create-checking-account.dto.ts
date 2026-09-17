/**
 * @summary
 * Defines the payload for creating a `CheckingAccount`.
 *
 * @remarks
 * The value is a signed decimal string; the date is ISO
 * 8601. Value objects are built in the service mapper.
 *
 * @explanation
 * Use this DTO to create a checking account entry
 * through the service layer.
 *
 * @example
 * const DTO: CreateCheckingAccountDTO = {
 *   bankAccountId: "bank-account-1",
 *   date: "2026-01-01T00:00:00.000Z",
 *   value: "1000",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateCheckingAccountDTO {
  bankAccountId: string
  date: string
  value: string
}
