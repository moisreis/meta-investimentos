import { Button } from "@/presentation/ui/button"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { SIGN_IN } from "@/presentation/routes/auth/settings/form-labels.settings"

/**
 * @summary
 * Renders the barebones sign-in form markup.
 *
 * @remarks
 * The form uses the email and password input fields.
 * Submitting it is not wired to any authentication flow.
 *
 * @explanation
 * This form serves as a placeholder for the sign-in flow.
 * It renders the credencial fields using the shared field
 * primitives so the page can be loaded and iterated on.
 *
 * @returns The sign-in form.
 *
 * @example
 * <SignInForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
function SignInForm() {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>E-mail</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="seu@email.com"
              required
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Senha</FieldLabel>
          <FieldContent>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        {SIGN_IN.SIGN_IN_BUTTON}
      </Button>
    </form>
  )
}

export { SignInForm }
