// Copy of the feedback surfaces: the pending state, the
// route error boundary, the root error boundary and the
// not-found screen.
//
// The register is the one an accounting screen uses: what
// happened, what to do, and the reference a support call
// would quote. Nothing here apologises on behalf of the
// product, and nothing asks the reader to try again unless
// trying again is what will actually help.

/**
 * Address a feedback surface sends the reader to when it
 * offers a way out. The portfolio list is the screen the
 * shell lands on, so it is the one address every screen can
 * fall back to.
 */
export const SHARED_FEEDBACK_HOME_HREF = "/portfolio"

/**
 * Copy of the pending state of a screen that has not
 * resolved its data yet.
 */
export const SHARED_PENDING = {
  // Accessible label of the region that is loading.
  LABEL: "Carregando",
} as const

/**
 * Copy of the route error boundary, shown when a screen
 * inside the signed-in shell throws.
 */
export const SHARED_ROUTE_ERROR = {
  // Title of the failed screen.
  TITLE: "Esta tela não carregou",

  // What went wrong and what to do about it.
  DESCRIPTION:
    "Os dados que esta tela precisa não vieram. " +
    "Nada foi alterado. Tente de novo, ou siga para " +
    "as carteiras e entre por outro caminho.",

  // Retry action.
  RETRY_LABEL: "Tentar de novo",

  // Escape hatch back to the panel.
  BACK_LABEL: "Ir para as carteiras",
} as const

/**
 * Copy of the root error boundary, shown when the failure
 * took the document down with it.
 */
export const SHARED_GLOBAL_ERROR = {
  // Title of the failed application.
  TITLE: "A aplicação parou",

  // What went wrong, stated without euphemism.
  DESCRIPTION:
    "Um erro interrompeu a página antes de ela " +
    "pintar. Tente de novo; se voltar a acontecer, o " +
    "código abaixo identifica o que falhou.",

  // Recovery action of the root boundary.
  RETRY_LABEL: "Tentar de novo",
} as const

/**
 * Copy of the not-found screen.
 */
export const SHARED_NOT_FOUND = {
  // Title of the missing screen.
  TITLE: "Endereço não encontrado",

  // What the reader asked for and why it is not here.
  DESCRIPTION:
    "Nenhuma tela responde a este endereço. O " +
    "endereço pode ter mudado, ou o registro que " +
    "ele apontava não existe mais.",

  // Action that leads back into the application.
  HOME_LABEL: "Ir para as carteiras",
} as const

// Formats the label of the address that was not found.
function FormatRequestedPath(path: string): string {
  return `Endereço pedido: ${path}`
}

// Formats the reference a support call would quote, shown
// under the sentence of a failed screen.
function FormatErrorReference(
  digest: string | undefined
): string {
  return digest
    ? `Código do erro: ${digest}`
    : "Código do erro: não informado"
}

export { FormatErrorReference, FormatRequestedPath }
