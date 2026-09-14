/**
 * @summary
 * Renders the layout for the `(auth)` route group.
 *
 * @remarks
 * The layout centers the children inside the auth area.
 * It also shows the application brand above the content.
 *
 * @explanation
 * This layout wraps the authentication pages in a shared frame.
 * It keeps the sign-in and sign-up routes visually consistent.
 * Use it for screens related to authentication flows.
 *
 * @param props - Props of the authentication layout.
 * @param props.children - Content rendered by the layout.
 * @returns The authentication layout frame.
 *
 * @example
 * <AuthLayout>
 *   <SignInPage />
 * </AuthLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Meta Investimentos
          </h1>
        </header>
        {children}
      </div>
    </main>
  );
}