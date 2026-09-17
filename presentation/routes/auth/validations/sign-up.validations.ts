import { z } from "zod"
import { unmaskCPF } from "@/presentation/masks/cpf.mask"

/**
 * @summary
 * Validates a **CPF** by its check digits.
 *
 * @remarks
 * Accepts masked (`000.000.000-00`) or digits-only values.
 * Rejects repeated digit sequences and wrong check digits.
 *
 * @param value - Masked or raw **CPF** string.
 *
 * @returns Whether the **CPF** is valid.
 *
 * @example
 * const VALID = isValidCpf("529.982.247-25");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
function isValidCpf(value: string): boolean {
  const digits = unmaskCPF(value)

  if (!/^\d{11}$/.test(digits)) {
    return false
  }

  if (new Set(digits).size === 1) {
    return false
  }

  function checkDigit(position: number): number {
    const sum = digits
      .slice(0, position - 1)
      .split("")
      .reduce(
        (total, digit, index) => total + Number(digit) * (position - index),
        0
      )

    const remainder = sum % 11

    return remainder < 2 ? 0 : 11 - remainder
  }

  return (
    Number(digits[9]) === checkDigit(10) &&
    Number(digits[10]) === checkDigit(11)
  )
}

const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo."),
  firstName: z.string().trim().min(1, "Informe seu nome."),
  lastName: z.string().trim().min(1, "Informe seu sobrenome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  cpf: z.string().refine(isValidCpf, {
    message: "Informe um CPF válido.",
  }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})

type SignUpFormValues = z.infer<typeof signUpFormSchema>

export { signUpFormSchema, type SignUpFormValues }
