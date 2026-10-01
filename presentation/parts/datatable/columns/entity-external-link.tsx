/**
 * Props for the entity external link cell.
 */
export interface EntityExternalLinkProps {
  // The address the cell opens in a new tab.
  href: string

  // Link content.
  label: string
}

/**
 * @summary
 * Renders a datatable cell that opens an address elsewhere.
 *
 * @remarks
 * A row can hold a file the user is meant to fetch rather
 * than a value they can read in place: a generated statement,
 * an exported report. The cell is a link with the two
 * attributes that make opening it in a new tab safe, so no
 * route has to remember them, and the wording stays with the
 * module instead of being read off the file name.
 *
 * Naming the destination `href` and the wording `label`
 * matches the router links elsewhere in the kit, so a route
 * that points at a page and one that points at a file read the
 * same way at the call site.
 *
 * @explanation
 * Use for a column whose value is an address to open. Pass the
 * address and the link wording; the cell owns the styling and
 * the tab-safety attributes.
 *
 * @param props - Props of the external link cell.
 * @param props.href - The address the cell opens.
 * @param props.label - Link content.
 *
 * @returns The external link cell.
 *
 * @example
 * <EntityExternalLink
 *   href={info.getValue()}
 *   label={STATEMENT_DATATABLE.COLUMN_FILE_OPEN_LABEL}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function EntityExternalLink({
  href,
  label,
}: EntityExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {label}
    </a>
  )
}

export { EntityExternalLink }
