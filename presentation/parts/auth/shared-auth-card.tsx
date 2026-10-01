import { cn } from "cn"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card"
import { Separator } from "@/presentation/ui/separator"

interface SharedAuthCardProps {
  // Heading of the card.
  title: React.ReactNode

  // Sub-heading of the card.
  description: React.ReactNode

  // The form itself.
  children: React.ReactNode

  // Rendered below the fields, separated from them. The link
  // to the other screen goes here.
  footer: React.ReactNode

  // Classes merged into the card.
  className?: string
}

/**
 * @summary
 * Renders the card that hosts an auth form.
 *
 * @remarks
 * Gives the form its title, its description, a separator,
 * the fields and a footer, so the sign in and the sign up
 * screens share one shape. The footer is a slot rather than a
 * fixed child, because what belongs there is the route's
 * decision, not this card's.
 *
 * The card sits above the backdrop, which is why it carries a
 * stacking level of its own.
 *
 * @param props - Props of the card.
 * @param props.title - Heading of the card.
 * @param props.description - Sub-heading of the card.
 * @param props.children - The form itself.
 * @param props.footer - Rendered below the fields.
 * @param props.className - Classes merged into the card.
 *
 * @returns The card hosting the auth form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function SharedAuthCard({
  title,
  description,
  children,
  footer,
  className,
}: SharedAuthCardProps) {
  return (
    <Card className={cn("relative z-10", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        {footer}
      </CardFooter>
    </Card>
  )
}

export { SharedAuthCard }
