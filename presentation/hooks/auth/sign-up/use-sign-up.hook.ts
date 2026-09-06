"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { CPF } from "@/business/value-objects/cpf.vo";
import { AUTH_CLIENT } from "@/infrastructure/clients/auth.client";
import { toast } from "@/presentation/components/ui/toast";
import { unmaskCpf } from "@/presentation/presenters/cpf.mask";

interface SignUpCredentials {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  password: string;
  passwordConfirmation: string;
}

const SIGN_UP_ERROR_TITLE = "Não foi possível criar a conta";

const SIGN_UP_SCHEMA = z
  .object({
    name: z.string().trim().min(1, { message: "Informe seu nome completo." }),
    firstName: z.string().trim().min(1, { message: "Informe seu nome." }),
    lastName: z.string().trim().min(1, { message: "Informe seu sobrenome." }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Informe seu e-mail." })
      .email("Informe um e-mail válido."),
    cpf: z.string().refine(
      (value) => {
        try {
          CPF.create(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "O CPF informado é inválido." },
    ),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas informadas não coincidem.",
    path: ["passwordConfirmation"],
  });

/**
 * Handles the sign-up submission.
 *
 * Every input is validated at the form boundary — including the CPF
 * check-digit algorithm through the `CPF` value object — before the request
 * is issued. The payload is then sent to the `/api/auth/sign-up/email`
 * endpoint through the browser *Better Auth* client, storing the CPF with
 * only its digits.
 *
 * The outcome is always reported through a toast. Sign-up creates a session
 * automatically, so the user is redirected to the application main page on
 * success.
 */
export function useSignUp() {
  const router = useRouter();
  const [IS_LOADING, SET_IS_LOADING] = useState(false);

  async function signUp(credentials: SignUpCredentials): Promise<void> {
    SET_IS_LOADING(true);

    const PARSED = SIGN_UP_SCHEMA.safeParse(credentials);

    if (!PARSED.success) {
      toast.add({
        title: SIGN_UP_ERROR_TITLE,
        description:
          PARSED.error.issues[0]?.message ?? "Revise os dados informados.",
        type: "error",
      });
      SET_IS_LOADING(false);
      return;
    }

    const PAYLOAD = {
      email: PARSED.data.email,
      name: PARSED.data.name,
      password: PARSED.data.password,
      firstName: PARSED.data.firstName,
      lastName: PARSED.data.lastName,
      cpf: unmaskCpf(PARSED.data.cpf),
    };

    try {
      const RESULT = await AUTH_CLIENT.signUp.email(PAYLOAD);

      if (RESULT.error) {
        toast.add({
          title: SIGN_UP_ERROR_TITLE,
          description: RESULT.error.message ?? "Revise os dados informados.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Meta Investimentos.",
        type: "success",
      });

      router.push("/main");
    } catch {
      toast.add({
        title: SIGN_UP_ERROR_TITLE,
        description: "Não foi possível conectar. Tente novamente.",
        type: "error",
      });
    } finally {
      SET_IS_LOADING(false);
    }
  }

  return { IS_LOADING, SIGN_UP: signUp };
}
