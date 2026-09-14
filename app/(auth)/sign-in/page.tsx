import Link from "next/link";
import { Button } from "@/presentation/ui/button";

/**
 * @summary
 * Renders the sign-in page content.
 *
 * @remarks
 * The page presents the email and password form fields.
 * It also offers a link to the sign-up route.
 *
 * @explanation
 * This page serves as the authentication entry point.
 * It renders the barebones sign-in form markup so the
 * application can be loaded and iterated on.
 *
 * @returns The sign-in page section.
 *
 * @example
 * <SignInPage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function SignInPage() {
  return (
    <section className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-medium">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to access your investments.
        </p>
      </div>

      <form className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </section>
  );
}