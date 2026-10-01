import { BRAND } from "@/presentation/constants/brand.constants"

/**
 * @summary
 * Brand copyright notice pinned to the auth screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
const CURRENT_YEAR = new Date().getFullYear()

export const AUTH_COPYRIGHT =
  `© ${CURRENT_YEAR} ${BRAND.LEGAL_NAME}. ` +
  `Todos os direitos reservados.`

/**
 * @summary
 * Fallback shown when a form fails without saying why.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export const AUTH_VALIDATION_ERROR =
  "Revise os campos destacados no formulário."

/**
 * @summary
 * Form labels for the authentication screens.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */

export const SIGN_IN = {
  // Title of the sign-in screen.
  SIGN_IN_TITLE: "Bem-vindo de volta!",

  // Sign-in's button content.
  SIGN_IN_BUTTON: "Entrar",

  // Short description of the sign-in screen.
  SIGN_IN_DESCRIPTION:
    "Acesse sua conta para gerenciar seus investimentos.",

  // Invitation text for users without an account.
  DOES_NOT_HAVE_AN_ACCOUNT_TEXT: "Não possui uma conta?",

  // Label of the link that leads to the sign-up screen.
  DOES_NOT_HAVE_AN_ACCOUNT_LINK: "Cadastre-se",
  // Field label: the email.
  LABEL_EMAIL: "E-mail",
  // Field placeholder: the email.
  PLACEHOLDER_EMAIL: "seu@email.com",
  // Field label: the password.
  LABEL_PASSWORD: "Senha",
  // Button content while the request runs: the the button.
  PENDING_BUTTON: "Entrando",
} as const

// Form labels for the registration screens.
export const SIGN_UP = {
  // Title of the sign-up screen.
  SIGN_UP_TITLE: "Olá! Como está?",

  // Sign-up's button content.
  SIGN_UP_BUTTON: "Criar Conta",

  // Short description of the sign-up screen.
  SIGN_UP_DESCRIPTION:
    "Crie sua conta para " +
    "começar a gerenciar seus investimentos.",

  // Invitation text for users with an existing account.
  ALREADY_HAVE_AN_ACCOUNT_TEXT: "Já possui uma conta?",

  // Label of the link that leads to the sign-in screen.
  ALREADY_HAVE_AN_ACCOUNT_LINK: "Entrar",
  // Field label: the full name.
  LABEL_FULL_NAME: "Nome completo",
  // Field placeholder: the full name.
  PLACEHOLDER_FULL_NAME: "Maria Oliveira",
  // Field label: the first name.
  LABEL_FIRST_NAME: "Nome",
  // Field placeholder: the first name.
  PLACEHOLDER_FIRST_NAME: "Maria",
  // Field label: the last name.
  LABEL_LAST_NAME: "Sobrenome",
  // Field placeholder: the last name.
  PLACEHOLDER_LAST_NAME: "Oliveira",
  // Field label: the email.
  LABEL_EMAIL: "E-mail",
  // Field placeholder: the email.
  PLACEHOLDER_EMAIL: "seu@email.com",
  // Field label: the cpf.
  LABEL_CPF: "CPF",
  // Field label: the password.
  LABEL_PASSWORD: "Senha",
  // Button content while the request runs: the the button.
  PENDING_BUTTON: "Criando conta",
} as const
