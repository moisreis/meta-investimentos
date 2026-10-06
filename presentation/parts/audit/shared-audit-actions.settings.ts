/**
 * @summary
 * Display payload of an audited action.
 *
 * @remarks
 * The label is the Brazilian Portuguese word the product
 * shows for the action, and the variant is the badge tone
 * that goes with it.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export interface AuditActionDisplay {
  // Human-friendly action label.
  label: string

  // Badge variant used to render the action.
  variant: "default" | "secondary" | "destructive" | "outline"
}

/**
 * @summary
 * The actions the product records, and how each one reads.
 *
 * @remarks
 * A server action names one of these tokens when it records
 * what it did. The audit log screen and the header
 * notification both render the same token through this table,
 * so the same act is worded the same way in both places
 * instead of being spelled out once per consumer.
 *
 * @explanation
 * Add a token here when the product gains a new kind of
 * auditable act, then let the formatters resolve it. Neither
 * consumer needs to change: both fall back to the raw token
 * when it is unknown, so a legacy or third-party row still
 * renders.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export const AUDIT_ACTIONS = {
  // A record was created.
  CREATED: { label: "Criado", variant: "default" },

  // A report was built and stored.
  GENERATED: { label: "Gerado", variant: "default" },

  // Rows were brought in from an external source.
  IMPORTED: { label: "Importado", variant: "default" },

  // A derived figure was computed.
  CALCULATED: { label: "Calculado", variant: "default" },

  // A booked record was undone rather than erased.
  REVERSED: { label: "Estornado", variant: "outline" },

  // A record was edited in place.
  UPDATED: { label: "Atualizado", variant: "secondary" },

  // A record was removed.
  DELETED: { label: "Excluído", variant: "destructive" },
} as const satisfies Record<string, AuditActionDisplay>

// Token of a recorded audit action.
export type AuditActionToken = keyof typeof AUDIT_ACTIONS
