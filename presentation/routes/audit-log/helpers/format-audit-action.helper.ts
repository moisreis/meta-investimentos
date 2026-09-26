// Display payload of an audit action badge.
export interface AuditActionDisplay {
  // Human-friendly action label.
  label: string

  // Badge variant used to render the action.
  variant: "default" | "secondary" | "destructive" | "outline"
}

// Known audit actions with their display payload.
const AUDIT_ACTION_LABELS: Record<string, AuditActionDisplay> = {
  CREATED: { label: "Criado", variant: "default" },
  GENERATED: { label: "Gerado", variant: "default" },
  UPDATED: { label: "Atualizado", variant: "secondary" },
  DELETED: { label: "Excluído", variant: "destructive" },
}

/**
 * @summary
 * Resolves the display payload of an audit action.
 *
 * @remarks
 * Matches the action token case-insensitively against a
 * known set and falls back to the raw value with a neutral
 * variant when unknown.
 *
 * @explanation
 * Use this helper in the datatable cells so the action
 * column renders a readable Brazilian label with a
 * color-coded badge.
 *
 * @param action - The recorded audit action token.
 *
 * @returns The label and badge variant.
 *
 * @example
 * const DISPLAY = FormatAuditAction("DELETED");
 * // returns { label: "Excluído", variant: "destructive" }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatAuditAction(
  action: string
): AuditActionDisplay {
  const KEY = action.trim().toUpperCase()

  return (
    AUDIT_ACTION_LABELS[KEY] ?? {
      label: action,
      variant: "outline",
    }
  )
}
