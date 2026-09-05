import type { Metadata } from "next";

import AuthShell from "@/components/groups/auth/auth-shell";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthShell>{children}</AuthShell>;
}