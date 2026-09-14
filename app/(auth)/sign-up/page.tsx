import Link from "next/link";
import { Button } from "@/presentation/ui/button";

/**
 * @summary
 * Renders the sign-up page content.
 *
 * @remarks
 * The page presents the account creation form fields.
 * It also offers a link to the sign-in route.
 *
 * @explanation
 * This page serves as the registration entry point.
 * It renders the barebones sign-up form markup so the
 * application can be loaded and iterated on.
 *
 * @returns The sign-up page section.
 *
 * @example
 * <SignUpPage />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-14
 */
export default function SignUpPage() {
  return (
    <section className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-medium">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Register to start managing your investments.
        </p>
      </div>

      <form className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

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
            autoComplete="new-password"
            required
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}