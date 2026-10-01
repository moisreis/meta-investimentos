import {
  Card,
  CardContent,
  CardHeader,
} from "@/presentation/ui/card"
import { Separator } from "@/presentation/ui/separator"
import { Skeleton } from "@/presentation/ui/skeleton"

// Placeholder fields in the form body, matching the number of
// fields the sign-in screen opens with.
const FIELD_ROW_COUNT = 2

/**
 * @summary
 * Renders the placeholder of an auth screen while its form
 * is on its way.
 *
 * @remarks
 * Mirrors the auth card: a heading, a separator, a couple of
 * labelled fields and a button. The card sits at the same
 * width and in the same place as the real one, so the form
 * arrives without moving anything on the page.
 *
 * @explanation
 * Use as the fallback of `app/(auth)/loading.tsx`.
 *
 * @returns The auth screen placeholder.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function SharedAuthFormSkeleton() {
  const FIELDS = Array.from({ length: FIELD_ROW_COUNT })

  return (
    <div className="w-full max-w-sm space-y-6">
      <Card className="relative z-10">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-4">
          {FIELDS.map((_, INDEX) => (
            <div key={INDEX} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}

          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export { SharedAuthFormSkeleton }
