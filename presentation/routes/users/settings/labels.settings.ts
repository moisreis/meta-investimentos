import type { UserRole } from "@/services/user/dto/create-user.dto"

// Form copy for the user add/edit screens.
export const USER_FORM = {
  // Add button content.
  ADD_BUTTON: "Cadastrar Usuário",

  // Add pending button content.
  ADD_PENDING_BUTTON: "Cadastrando usuário",

  // Edit button content.
  EDIT_BUTTON: "Salvar Alterações",

  // Edit pending button content.
  EDIT_PENDING_BUTTON: "Salvando alterações",

  // Success toast title after creating a user.
  CREATE_SUCCESS_TITLE: "Usuário cadastrado!",

  // Success toast description after creating a user.
  CREATE_SUCCESS_DESCRIPTION:
    "O usuário foi cadastrado com sucesso.",

  // Success toast title after updating a user.
  UPDATE_SUCCESS_TITLE: "Usuário atualizado!",

  // Success toast description after updating a user.
  UPDATE_SUCCESS_DESCRIPTION: "As informações foram salvas.",

  // Error toast title for the user forms.
  ERROR_TITLE: "Não foi possível salvar o usuário",
} as const

// Dialog copy for the user add/edit flows.
export const USER_DIALOG = {
  // Add dialog header.
  ADD_TITLE: "Novo usuário",
  ADD_DESCRIPTION: "Preencha os dados do novo usuário.",

  // Add-another prompt dialog.
  ADD_ANOTHER_TITLE: "Adicionar outro usuário?",
  ADD_ANOTHER_DESCRIPTION:
    "O usuário foi cadastrado com sucesso. O que deseja fazer?",
  ADD_ANOTHER_BACK_LABEL: "Voltar para a tabela",
  ADD_ANOTHER_ANOTHER_LABEL: "Adicionar outro",

  // Edit dialog header.
  EDIT_TITLE: "Editar usuário",
  EDIT_DESCRIPTION: "Atualize os dados do usuário.",
} as const

// Datatable copy for the user list screen.
export const USER_DATATABLE = {
  // Column headers.
  COLUMN_NAME: "Usuário",
  COLUMN_CPF: "CPF",
  COLUMN_ROLE: "Perfil",
  COLUMN_EMAIL_VERIFIED: "E-mail verificado",
  COLUMN_CREATED_AT: "Cadastro",

  // Toolbar filter copy.
  FILTER_SEARCH_PLACEHOLDER: "Buscar por nome ou e-mail",

  // Row actions menu.
  ROW_ACTIONS_LABEL: "Ações",
  ROW_EDIT_LABEL: "Editar",
  ROW_DELETE_LABEL: "Excluir",

  // Single delete dialog.
  DELETE_TITLE: "Excluir usuário",
  DELETE_CONFIRM_LABEL: "Excluir",
  DELETE_CANCEL_LABEL: "Cancelar",

  // Delete result toast copy.
  DELETE_SUCCESS_TITLE: "Usuário excluído!",
  DELETE_SUCCESS_DESCRIPTION:
    "O usuário foi excluído com sucesso.",
  DELETE_ERROR_TITLE: "Não foi possível excluir o usuário",

  // Bulk delete result toast copy.
  BULK_DELETE_SUCCESS_TITLE: "Usuários excluídos!",
  BULK_DELETE_SUCCESS_DESCRIPTION:
    "Os usuários selecionados foram excluídos.",
  BULK_DELETE_ERROR_TITLE:
    "Não foi possível excluir os usuários",
} as const

// Role display labels.
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: "Usuário",
  MANAGER: "Gerente",
}

// Email verification display labels.
export const USER_EMAIL_VERIFIED_LABELS = {
  // Verified email label.
  YES: "Sim",

  // Unverified email label.
  NO: "Não",
} as const

// Column id to header label used by the edit-columns menu.
export const USER_DATATABLE_COLUMN_LABELS: Record<
  string,
  string
> = {
  name: USER_DATATABLE.COLUMN_NAME,
  maskedCpf: USER_DATATABLE.COLUMN_CPF,
  role: USER_DATATABLE.COLUMN_ROLE,
  emailVerified: USER_DATATABLE.COLUMN_EMAIL_VERIFIED,
  createdAt: USER_DATATABLE.COLUMN_CREATED_AT,
}

// KPI card copy for the user list screen.
export const USER_KPI = {
  // Total user count card.
  USERS_COUNT_TITLE: "Usuários",
  USERS_COUNT_COMPARISON: "usuários cadastrados",

  // Total manager count card.
  MANAGERS_COUNT_TITLE: "Gerentes",
  MANAGERS_COUNT_COMPARISON: "usuários gerentes",

  // Users with a verified email card.
  VERIFIED_COUNT_TITLE: "E-mails verificados",
  VERIFIED_COUNT_COMPARISON: "usuários verificados",

  // Users awaiting email verification card.
  PENDING_COUNT_TITLE: "E-mails pendentes",
  PENDING_COUNT_COMPARISON: "usuários sem verificação",
} as const

// Formats the delete dialog description with the name.
function FormatDeleteUserDescription(name: string): string {
  return (
    `Deseja excluir o usuário "${name}"? ` +
    "Esta ação não pode ser desfeita."
  )
}

// Empty state copy for the user list screen.
export const USER_EMPTY = {
  TITLE: "Nenhum usuário cadastrado",
  DESCRIPTION:
    "Cadastre o primeiro usuário para gerenciar o acesso ao sistema.",
  PRIMARY_ACTION_LABEL: USER_FORM.ADD_BUTTON,
} as const

export { FormatDeleteUserDescription }
