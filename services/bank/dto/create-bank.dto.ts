/**
 * @summary
 * Defines the payload for creating a `Bank`.
 *
 * @remarks
 * The bank code is a unique institutional identifier.
 *
 * @explanation
 * Use this DTO to create a bank through the service
 * layer.
 *
 * @example
 * const DTO: CreateBankDTO = {
 *   code: "001",
 *   name: "Banco do Brasil",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBankDTO {
  code: string
  name: string
}
