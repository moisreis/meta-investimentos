/**
 * @summary
 * Withdrawal row rendered by the presentation layer.
 *
 * @remarks
 * Projects the withdrawal read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 *The `reversedByUserId`, `createdAt`, `updatedAt` fields stay in
 *  the service layer.
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
export interface WithdrawalRow {
  id: string
  positionId: string
  date: string
  amount: string
  quotas: string
  // Null while the withdrawal has not been reversed.
  reversedAt: string | null
}
