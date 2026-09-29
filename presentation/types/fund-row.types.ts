/**
 * @summary
 * Fund row rendered by the presentation layer.
 *
 * @remarks
 * Projects the fund read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 *The `createdAt`, `updatedAt` fields stay in the service layer.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface FundRow {
  id: string
  cnpj: string
  name: string
  // Null when no administration fee is set.
  administrationFee: string | null
  // Null when no performance fee is set.
  performanceFee: string | null
  bankId: string
  // Null when no benchmark is linked.
  benchmarkId: string | null
  // Null when no category is linked.
  categoryId: string | null
}
