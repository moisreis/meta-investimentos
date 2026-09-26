// Display data of the user who performed an audited action.
export interface AuditLogActor {
  // First name of the acting user.
  firstName: string

  // Last name of the acting user.
  lastName: string

  // Avatar image URL when one is registered.
  image: string | null
}

// Derived data rendered on an audit log row.
export interface AuditLogRowSummary {
  // Display data of the acting user, or null for
  // system-scoped logs.
  actor: AuditLogActor | null
}
