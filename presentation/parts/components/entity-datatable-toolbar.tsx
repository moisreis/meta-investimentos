interface EntityDatatableToolbarProps {
  filters?: React.ReactNode
  actions?: React.ReactNode
}

export function EntityDatatableToolbar({
  filters,
  actions,
}: EntityDatatableToolbarProps): React.ReactElement {
  return (
    <div className="flex min-h-11 w-full flex-row items-center justify-between border-b border-border px-3">
      <div className="flex flex-row items-center justify-start gap-2">
        {filters}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        {actions}
      </div>
    </div>
  )
}
