import * as React from "react"
import { cn } from "cn"

/**
 * @summary
 * Renders a native **select** element.
 *
 * @remarks
 * A plain styled `<select>` that matches the input
 * height, border, and focus ring so it can sit side
 * by side with the form text fields. Stays native to
 * keep full keyboard and screen-reader support.
 *
 * @explanation
 * Use as the option picker of entity forms that link
 * to a registry such as a bank or a category. Render
 * the choices as `option` children and control the
 * selection through `value` and `onChange`.
 *
 * @param props - Props forwarded to the select.
 *
 * @returns The native select element.
 *
 * @example
 * <NativeSelect value={bankId} onChange={onChange}>
 *   <option value="">Selecione</option>
 * </NativeSelect>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { NativeSelect }
