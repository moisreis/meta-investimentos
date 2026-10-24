import type { JSX, ReactNode } from "react"

interface EntityDatatableKpiGroupProps {
  children: ReactNode
}

/**
 * @summary
 * Renders the strip of KPI cards of a list screen.
 *
 * @remarks
 * On a wide screen the strip is a row of cards that share
 * the width evenly. On a narrow one there is no width to
 * share, so the strip scrolls sideways and every card keeps
 * a floor of its own. A figure squeezed into a quarter of a
 * phone is a figure the reader cannot read, which is worse
 * than one they have to scroll to reach.
 *
 * The height is fixed, so the strip never changes the shape
 * of the screen when the data arrives.
 *
 * @explanation
 * Use this part as the first block of a list screen. It owns
 * the scroll container and the height of the strip, and it
 * renders the cards it is given without knowing how many
 * there are.
 *
 * @param props - Props of the KPI group.
 * @param props.children - The KPI cards of the strip.
 *
 * @returns The KPI strip.
 *
 * @example
 * <EntityDatatableKpiGroup>
 *   {KPIS.map((KPI) => (
 *     <EntityDatatableKpiCard key={KPI.key} {...KPI} />
 *   ))}
 * </EntityDatatableKpiGroup>
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
export function EntityDatatableKpiGroup({
  children,
}: EntityDatatableKpiGroupProps): JSX.Element {
  return (
    <section className="flex h-32 w-full flex-row items-center overflow-x-auto overscroll-x-contain border-b border-border">
      {children}
    </section>
  )
}
