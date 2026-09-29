import type { UserRole } from "@/lib/auth/user-role"

/**
 * @summary
 * User row rendered by the presentation layer.
 *
 * @remarks
 * Projects the user read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 *The `cpf`, `image`, `updatedAt` fields stay in the service
 *  layer.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface UserRow {
  id: string
  name: string
  // Raw CPF (not masked) for server calls.
  cpf: string
  email: string
  firstName: string
  lastName: string
  // Partially masked `CPF` for safe display.
  maskedCpf: string
  role: UserRole
  emailVerified: boolean
  // Avatar image URL when one is registered.
  image: string | null
  createdAt: string
}
