"use client";

import { cn } from "cn";
import type { ComponentProps, SubmitEvent } from "react";
import { useState } from "react";

import { Button } from "@/presentation/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/presentation/components/ui/field";
import { Input } from "@/presentation/components/ui/input";
import { Spinner } from "@/presentation/components/ui/spinner";
import { useSignUp } from "@/presentation/hooks/auth/sign-up/use-sign-up.hook";
import { maskCpf } from "@/presentation/presenters/cpf.mask";

/**
 * The sign-up form.
 *
 * Every field maps to a required column on the `user` table (`name`,
 * `first_name`, `last_name`, `cpf`, `email`) or to the credential stored
 * in the `account` table (`password`). The password confirmation is not
 * persisted; it only guards against typos before submission.
 *
 * The CPF field keeps its own masked state so the value is formatted as
 * `000.000.000-00` while the user types.
 */
export function SignUpForm({
  className,
  onSubmit,
  ...props
}: ComponentProps<"form">) {
  const [cpf, setCpfValue] = useState("");
  const { IS_LOADING, SIGN_UP } = useSignUp();

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    onSubmit?.(event);

    const FORM = new FormData(event.currentTarget);

    await SIGN_UP({
      name: String(FORM.get("name") ?? ""),
      firstName: String(FORM.get("firstName") ?? ""),
      lastName: String(FORM.get("lastName") ?? ""),
      email: String(FORM.get("email") ?? ""),
      cpf,
      password: String(FORM.get("password") ?? ""),
      passwordConfirmation: String(FORM.get("password_confirmation") ?? ""),
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
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Preencha seus dados para começar
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nome completo</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Maria da Silva"
            autoComplete="name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="firstName">Nome</FieldLabel>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Maria"
            autoComplete="given-name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
          <Input
            id="lastName"
            name="lastName"
            placeholder="da Silva"
            autoComplete="family-name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="cpf">CPF</FieldLabel>
          <Input
            id="cpf"
            name="cpf"
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            autoComplete="off"
            value={cpf}
            onChange={(event) =>
              setCpfValue(maskCpf(event.currentTarget.value))
            }
            required
          />
        </Field>
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
            minLength={8}
            autoComplete="new-password"
            required
          />
          <FieldDescription>Use pelo menos 8 caracteres</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="passwordConfirmation">
            Confirmar senha
          </FieldLabel>
          <Input
            id="passwordConfirmation"
            name="password_confirmation"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={IS_LOADING}
          >
            {IS_LOADING && <Spinner data-icon="inline-start" />}
            {IS_LOADING ? "Criando conta..." : "Criar conta"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Já tem uma conta?{" "}
            <a
              href="/auth/sign-in"
              className="underline underline-offset-4"
            >
              Entre aqui.
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
