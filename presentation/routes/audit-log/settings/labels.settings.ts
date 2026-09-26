// Datatable copy for the audit log list screen.
export const AUDIT_LOG_DATATABLE = {
  // Column headers.
  COLUMN_CREATED_AT: "Data",
  COLUMN_ENTITY: "Entidade",
  COLUMN_ENTITY_ID: "Registro",
  COLUMN_ACTION: "Ação",
  COLUMN_CHANGES: "Alterações",
  COLUMN_ACTOR: "Agente",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER:
    "Buscar por entidade, ação ou registro",
} as const

// Column id to header label used by the edit-columns menu.
export const AUDIT_LOG_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  createdAt: AUDIT_LOG_DATATABLE.COLUMN_CREATED_AT,
  entity: AUDIT_LOG_DATATABLE.COLUMN_ENTITY,
  entityId: AUDIT_LOG_DATATABLE.COLUMN_ENTITY_ID,
  action: AUDIT_LOG_DATATABLE.COLUMN_ACTION,
  changes: AUDIT_LOG_DATATABLE.COLUMN_CHANGES,
  actor: AUDIT_LOG_DATATABLE.COLUMN_ACTOR,
}

// KPI card copy for the audit log list screen.
export const AUDIT_LOG_KPI = {
  // Total entries card.
  TOTAL_TITLE: "Registros",
  TOTAL_COMPARISON: "registros de atividade",

  // Entity coverage card.
  ENTITIES_TITLE: "Entidades",
  ENTITIES_COMPARISON: "entidades auditadas",

  // Action coverage card.
  ACTIONS_TITLE: "Ações",
  ACTIONS_COMPARISON: "tipos de ação",

  // Recent activity card.
  RECENT_TITLE: "Últimas 24h",
  RECENT_COMPARISON: "atividades recentes",
} as const

// Empty state copy for the audit log list screen.
export const AUDIT_LOG_EMPTY = {
  TITLE: "Nenhuma atividade registrada",
  DESCRIPTION:
    "As alterações do sistema aparecerão aqui " +
    "conforme forem registradas.",
} as const
