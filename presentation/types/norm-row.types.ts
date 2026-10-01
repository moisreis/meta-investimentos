/**
 * @summary
 * Norm row rendered by the presentation layer.
 *
 * @remarks
 * Projects the norm read model onto the fields the
 * screens actually render. Every allocation stays a
 * decimal string so the presenters are the only place
 * that formats it. The `createdAt` and `updatedAt`
 * fields stay in the service layer.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface NormRow {
  id: string
  articleNumber: string
  name: string
  categoryId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}
