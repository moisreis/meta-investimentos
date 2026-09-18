import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"
import { Separator } from "@/presentation/ui/separator"
import { AsciiFluid } from "@/presentation/ui/ascii-fluid"
import { AuthSecondaryLink } from "@/presentation/routes/auth/components/auth-secondary-link"
import { Copyright } from "@/presentation/routes/auth/components/copyright"

/**
 * @summary
 * Renders the shared frame for the `(auth)` route group.
 *
 * @remarks
 * The layout centers the children inside the auth area.
 * It also shows the brand name above the page content.
 *
 * @explanation
 * This layout wraps the authentication pages in a shared frame.
 * It keeps the sign-in and sign-up routes visually consistent.
 * Use it for screens related to authentication flows.
 *
 * @param props - Props of the authentication layout.
 * @param props.children - Content rendered inside the frame.
 * @param props.description - Description text of the auth route.
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
function AuthLayout({
  children,
  description,
  title,
}: Readonly<{
  children: React.ReactNode
  description: string
  title: string
}>) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <AsciiFluid
          backgroundColor="#f4f4f0"
          color="#1447e6"
          cellSize={24}
          className="absolute top-1/2 left-1/2 z-0 h-screen w-screen -translate-x-1/2 -translate-y-1/2"
        />
        <Card className="relative z-10">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>{children}</CardContent>
          <CardFooter className="justify-center">
            <AuthSecondaryLink />
          </CardFooter>
        </Card>
      </div>
      <Copyright />
    </main>
  )
}

export { AuthLayout }
