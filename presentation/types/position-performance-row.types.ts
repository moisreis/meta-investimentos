/**
 * @summary
 * Position performance row rendered by the presentation layer.
 *
 * @remarks
 * Projects the position performance read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 *The `applicationTotal`, `redemptionTotal`, `cashFlowNet`,
 *  `earnings`, `returnMonthly`, `returnYearly`, `returnLast12m`,
 *  `allocation`, `createdAt` fields stay in the service layer.
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
export interface PositionPerformanceRow {
  id: string
  positionId: string
  date: string
  // Total quotas held by the position.
  quotasHeld: string
  patrimony: string
  returnDaily: string
}
