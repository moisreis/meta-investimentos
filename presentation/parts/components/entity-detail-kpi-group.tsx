import type { JSX, ReactNode } from "react"

interface EntityDetailKpiGroupProps {
  children: ReactNode
}

/**
 * @summary
 * Groups the KPI cards of an entity detail screen.
 *
 * @remarks
 * The cards flow through a responsive grid: one column on
 * narrow screens, two from the small breakpoint and three
 * from the extra-large breakpoint, so a row never overflows
 * and the cards keep readable widths on wide screens.
 *
 * @param props - Props of the KPI card group.
 * @param props.children - The KPI cards of the group.
 *
 * @returns The KPI card group.
 *
 * @example
 * <EntityDetailKpiGroup>
 *   <EntityDetailKpiCard {...ONE} />
 *   <EntityDetailKpiCard {...TWO} />
 *   <EntityDetailKpiCard {...THREE} />
 * </EntityDetailKpiGroup>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function EntityDetailKpiGroup({
  children,
}: EntityDetailKpiGroupProps): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </section>
  )
}
