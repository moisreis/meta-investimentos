"use client"

import { authClient } from "@/clients/auth.client"

/**
 * Credentials of the sign-in form.
 */
export interface AuthSignInValues {
  email: string
  password: string
}

/**
 * Fields of the sign-up form.
 */
export interface AuthSignUpValues {
  name: string
  firstName: string
  lastName: string
  email: string
  cpf: string
  password: string
}

/**
 * Fields of the auth library response the presentation
 * layer reads. Only the error is named, because the payload
 * of a successful call is typed per operation.
 */
interface AuthResponse {
  error?: { code?: string; message?: string } | null
}

/**
 * Browser authentication operations available to the
 * presentation layer.
 */
export interface AuthOperations {
  signIn: (values: AuthSignInValues) => Promise<AuthResponse>
  signUp: (values: AuthSignUpValues) => Promise<AuthResponse>
}

/**
 * @summary
 * Exposes the browser authentication client to the
 * presentation layer.
 *
 * @remarks
 * This is the only place outside `clients/` allowed to name
 * the **Better-Auth** client. The sign-in and sign-up hooks
 * ask this container for the operation they need, so a route
 * module never depends on the shape of the auth library and
 * swapping the provider stays a single-file change.
 *
 * @explanation
 * Use from a client hook that submits credentials. The
 * returned operations already carry the library types, which
 * is why the caller does not have to narrow the response.
 *
 * @returns The authentication operations.
 *
 * @example
 * const { signIn } = AuthContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function AuthContainer(): AuthOperations {
  return {
    signIn: (values) => authClient.signIn.email(values),
    signUp: (values) =>
      authClient.signUp.email(
        values as Parameters<typeof authClient.signUp.email>[0]
      ),
  }
}

export { AuthContainer }
