import type { EntityId, CNPJ, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `Fund`.
 *
 * @remarks
 * The cnpj must be unique. Optional fees default to
 * null when omitted.
 *
 * @explanation
 * Use this DTO to create a fund through the service
 * layer.
 *
 * @example
 * const DTO: CreateFundDTO = {
 *   cnpj: CNPJ.create("12.345.678/0001-90"),
 *   name: "Fundo Master",
 *   bankId: EntityId.create("bank-1"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateFundDTO {
  cnpj: CNPJ
  name: string
  administrationFee?: SignedPercentage | null
  performanceFee?: SignedPercentage | null
  bankId: EntityId
  benchmarkId?: EntityId | null
  categoryId?: EntityId | null
}
