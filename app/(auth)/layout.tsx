/**
 * @summary
 * Renders the pass-through layout for the `(auth)` route group.
 *
 * @remarks
 * The layout renders the children without a shared frame.
 * Each auth route provides its own authentication layout.
 *
 * @explanation
 * This layout keeps the `(auth)` route group structure while
 * letting each route render **AuthLayout** with its own labels.
 * Use it to keep the group wrapper separate from route frames.
 *
 * @param props - Props of the authentication group layout.
 * @param props.children - Content rendered by the layout.
 * @returns The children rendered without a wrapper.
 *
 * @example
 * <AuthRouteLayout>
 *   <SignInPage />
 * </AuthRouteLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function AuthRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
