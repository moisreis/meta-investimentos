import type { JSX, ReactNode } from "react";

interface SharedKpiCardGroupProps {
  children: ReactNode;
}

/**
 * @summary
 * Container component for laying out **KPI** cards.
 *
 * @remarks
 * Encapsulates the layout container that houses multiple
 * **KPI** metrics, managing flex orientation and border.
 *
 * @explanation
 * Used to group related **KPI** card components into a unified
 * row-based visual section on dashboards.
 *
 * @param props - Component properties.
 * @param props.children - **KPI** cards rendered within group.
 *
 * @returns **JSX** element wrapping the child cards.
 *
 * @example
 * <SharedKpiCardGroup>
 *   <KpiCard title="Total" value="100" />
 * </SharedKpiCardGroup>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function SharedKpiCardGroup({
  children,
}: SharedKpiCardGroupProps): JSX.Element {
  return (
    <section className="flex h-32 w-full flex-row items-center justify-between border-b border-border p-0">
      {children}
    </section>
  );
}
