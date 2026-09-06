"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { AUTH_CLIENT } from "@/infrastructure/clients/auth.client";
import { toast } from "@/presentation/components/ui/toast";

interface SignInCredentials {
  email: string;
  password: string;
}

const SIGN_IN_ERROR_TITLE = "Não foi possível entrar";

const SIGN_IN_SCHEMA = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Informe seu e-mail." })
    .email("Informe um e-mail válido."),
  password: z.string().min(1, { message: "Informe sua senha." }),
});

/**
 * Handles the sign-in submission.
 *
 * Credentials are validated at the form boundary before any request is
 * issued, then sent to the `/api/auth/sign-in/email` endpoint through the
 * browser *Better Auth* client.
 *
 * The outcome is always reported through a toast; once the session is
 * established the user is redirected to the application main page.
 */
export function useSignIn() {
  const router = useRouter();
  const [IS_LOADING, SET_IS_LOADING] = useState(false);

  async function signIn({ email, password }: SignInCredentials): Promise<void> {
    SET_IS_LOADING(true);

    const PARSED = SIGN_IN_SCHEMA.safeParse({ email, password });

    if (!PARSED.success) {
      toast.add({
        title: SIGN_IN_ERROR_TITLE,
        description:
          PARSED.error.issues[0]?.message ?? "Revise os dados informados.",
        type: "error",
      });
      SET_IS_LOADING(false);
      return;
    }

    try {
      const RESULT = await AUTH_CLIENT.signIn.email({
        email: PARSED.data.email,
        password: PARSED.data.password,
      });

      if (RESULT.error) {
        toast.add({
          title: SIGN_IN_ERROR_TITLE,
          description:
            RESULT.error.message ??
            "Verifique suas credenciais e tente novamente.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Bem-vindo de volta!",
        description: "Você entrou em sua conta.",
        type: "success",
      });

      router.push("/main");
    } catch {
      toast.add({
        title: SIGN_IN_ERROR_TITLE,
        description: "Não foi possível conectar. Tente novamente.",
        type: "error",
      });
    } finally {
      SET_IS_LOADING(false);
    }
  }

  return { IS_LOADING, SIGN_IN: signIn };
}
