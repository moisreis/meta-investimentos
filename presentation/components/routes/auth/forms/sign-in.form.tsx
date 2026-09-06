"use client";

import { cn } from "cn";
import type { ComponentProps, SubmitEvent } from "react";

import { Button } from "@/presentation/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/presentation/components/ui/field";
import { Input } from "@/presentation/components/ui/input";
import { Spinner } from "@/presentation/components/ui/spinner";
import { useSignIn } from "@/presentation/hooks/auth/sign-in/use-sign-in.hook";

/**
 * The sign-in form.
 *
 * Authentication only requires the credentials stored in the `account`
 * table (`email` + `password`); all remaining user profile columns are
 * collected at sign-up.
 */
export function SignInForm({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) {
  const { IS_LOADING, SIGN_IN } = useSignIn();

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    onSubmit?.(event);

    const FORM = new FormData(event.currentTarget);

    await SIGN_IN({
      email: String(FORM.get("email") ?? ""),
      password: String(FORM.get("password") ?? ""),
    });
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Acesse sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Insira seu e-mail e senha para continuar
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={IS_LOADING}
          >
            {IS_LOADING && <Spinner data-icon="inline-start" />}
            {IS_LOADING ? "Entrando..." : "Entrar"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Não tem uma conta?{" "}
            <a
              href="/auth/sign-up"
              className="underline underline-offset-4"
            >
              Crie uma agora.
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
