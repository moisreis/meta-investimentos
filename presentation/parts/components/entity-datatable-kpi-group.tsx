import type { JSX, ReactNode } from "react"

interface SharedDatatableKpiCardGroupProps {
  children: ReactNode
}

export function EntityDatatableKpiGroup({
  children,
}: SharedDatatableKpiCardGroupProps): JSX.Element {
  return (
    <section className="flex h-32 w-full flex-row items-center justify-between border-b border-border p-0">
      {children}
    </section>
  )
}
