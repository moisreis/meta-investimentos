import {
  AUDIT_ACTIONS,
  type AuditActionDisplay,
} from "./shared-audit-actions.settings"

// Display shown for an action nobody has a word for.
const NEUTRAL_DISPLAY: AuditActionDisplay = {
  label: "",
  variant: "outline",
}

/**
 * @summary
 * Resolves the display payload of an audited action.
 *
 * @remarks
 * Matches the action token case-insensitively against the
 * known set. An unknown token keeps its recorded spelling and
 * reads in the neutral badge tone, because a row written by
 * another deployment should still be readable rather than
 * blank.
 *
 * @explanation
 * Use this helper wherever an audit action is rendered, so
 * the action column of the audit log and the header
 * notification cannot drift apart in wording.
 *
 * @param action - The recorded audit action token.
 *
 * @returns The label and badge variant of the action.
 *
 * @example
 * const DISPLAY = FormatAuditAction("CREATED");
 * // returns { label: "Criado", variant: "default" }
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function FormatAuditAction(
  action: string
): AuditActionDisplay {
  const TOKEN = action
    .trim()
    .toUpperCase() as keyof typeof AUDIT_ACTIONS
  const FOUND = AUDIT_ACTIONS[TOKEN]

  if (!FOUND) {
    return { ...NEUTRAL_DISPLAY, label: action.trim() || action }
  }

  return FOUND
}
