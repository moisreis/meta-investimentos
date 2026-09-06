import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/infrastructure/clients/better-auth.client";
import AuthShell from "@/presentation/components/routes/auth/shell/auth.shell";

export const metadata: Metadata = {
  title: "Entrar",
};

/**
 * The shared layout for the authentication routes.
 *
 * Signed-in users never see the sign-in or sign-up pages: the session is
 * resolved on the server for every request and authenticated users are
 * redirected to the application main page. Anonymous users render the
 * *Auth* shell around the current route's page.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const REQUEST_HEADERS = await headers();
  const SESSION = await auth.api.getSession({ headers: REQUEST_HEADERS });

  if (SESSION) {
    redirect("/main");
  }

  return <AuthShell>{children}</AuthShell>;
}
