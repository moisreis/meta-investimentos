import { Button } from "@/presentation/ui/button"
import { CpfInput } from "@/presentation/routes/auth/others/cpf-input"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { SIGN_UP } from "@/presentation/routes/auth/settings/form-labels.settings"

/**
 * @summary
 * Renders the barebones sign-up form markup.
 *
 * @remarks
 * The form collects the fields of the **User** entity.
 * Submitting it is not wired to any registration flow.
 *
 * @explanation
 * This form serves as a placeholder for the sign-up flow.
 * It renders the user fields using the shared field and
 * input primitives so the page can be iterated on.
 *
 * @returns The sign-up form.
 *
 * @example
 * <SignUpForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
function SignUpForm() {
  return (
    <form className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Nome completo</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Maria Oliveira"
              required
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Nome</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="firstName"
              placeholder="Maria"
              required
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Sobrenome</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="lastName"
              placeholder="Oliveira"
              required
            />
          </FieldContent>
        </Field>

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
          <FieldLabel>CPF</FieldLabel>
          <FieldContent>
            <CpfInput />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        {SIGN_UP.SIGN_UP_BUTTON}
      </Button>
    </form>
  )
}

export { SignUpForm }
