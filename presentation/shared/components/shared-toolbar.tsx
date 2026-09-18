interface ToolbarProps {
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * @summary
 * Shared toolbar component containing filter and action slots.
 *
 * @remarks
 * Displays a full-width flexible bar with left-aligned
 * filters and right-aligned action elements.
 *
 * @explanation
 * Use this component to standardize toolbars across views.
 * It encapsulates common layout styles and accepts slots for
 * customizable filter and action areas.
 *
 * @param filters - Filter controls to render on the left
 *                  side of the toolbar.
 * @param actions - Action controls to render on the right
 *                  side of the toolbar.
 *
 * @returns The rendered toolbar element.
 *
 * @example
 * <SharedToolbar
 *   filters={<button>Filter</button>}
 *   actions={<button>Export</button>}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export function SharedToolbar({
  filters,
  actions,
}: ToolbarProps): React.ReactElement {
  return (
    <div className="flex min-h-11 w-full flex-row items-center justify-between border-b border-border px-3">
      <div className="flex flex-row items-center justify-start gap-2">
        {filters}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        {actions}
      </div>
    </div>
  );
}
