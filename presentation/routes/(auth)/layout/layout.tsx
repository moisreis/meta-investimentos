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
import { SecondaryLink } from "@/presentation/routes/(auth)/components/secondary-link"
import { Copyright } from "@/presentation/routes/(auth)/components/copyright"

interface AuthLayoutProps {
  // Content rendered inside the card body.
  children: React.ReactNode

  // Short description below the card title.
  description: string

  // Title of the authentication screen.
  title: string
}

/**
 * @summary
 * Renders the shared authentication screen frame.
 *
 * @remarks
 * Composes the **AsciiFluid** background, a centered **Card**
 * with title, description and children, plus the secondary
 * link footer and the brand copyright notice.
 *
 * @explanation
 * Use this layout for the sign-in and sign-up routes to keep
 * a single visual frame across the authentication screens.
 * Pass the route-specific labels through the props.
 *
 * @param props - Props of the **AuthLayout** component.
 * @param props.children - Content rendered inside the card body.
 * @param props.description - Short description below the card title.
 * @param props.title - Title of the authentication screen.
 * @returns The authentication screen frame.
 *
 * @example
 * <AuthLayout title="Entrar" description="Acesse sua conta.">
 *   <SignInPage />
 * </AuthLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function AuthLayout({ children, description, title }: AuthLayoutProps) {
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
            <SecondaryLink />
          </CardFooter>
        </Card>
      </div>
      <Copyright />
    </main>
  )
}

export { AuthLayout }