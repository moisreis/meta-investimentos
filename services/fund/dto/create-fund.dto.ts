/**
 * @summary
 * Defines the payload for creating a `Fund`.
 *
 * @remarks
 * The cnpj must be unique. Optional fees default to
 * null when omitted. Cnpj and ids are strings; value
 * objects are built in the service mapper.
 *
 * @explanation
 * Use this DTO to create a fund through the service
 * layer.
 *
 * @example
 * const DTO: CreateFundDTO = {
 *   cnpj: "12.345.678/0001-90",
 *   name: "Fundo Master",
 *   bankId: "bank-1",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateFundDTO {
  cnpj: string
  name: string
  administrationFee?: string | null
  performanceFee?: string | null
  bankId: string
  benchmarkId?: string | null
  categoryId?: string | null
}
