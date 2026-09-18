// ---------------------------------
// INTERFACES
// ---------------------------------

import type { JSX } from "react";

/**
 * @summary
 * Defines component props.
 *
 * @remarks
 * Encapsulates properties for toolbar separation.
 *
 * @explanation
 * Provides type definitions for the extracted
 * toolbar separator component.
 *
 * @param className - Optional CSS class overrides.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export interface SharedToolbarSeparatorProps {
  className?: string;
}

// ---------------------------------
// COMPONENTS
// ---------------------------------

/**
 * @summary
 * Renders a toolbar separator.
 *
 * @remarks
 * Displays a vertical line with border styling.
 *
 * @explanation
 * Encapsulates the shared UI divider for toolbars.
 *
 * @param props - Component configuration props.
 *
 * @returns JSX Element.
 *
 * @example
 * const SEPARATOR = <SharedToolbarSeparator />;
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export function SharedToolbarSeparator(
  props: SharedToolbarSeparatorProps,
): JSX.Element {
  const { className } = props;

  return (
    <div
      className={
        className ?? "h-5 w-px bg-border"
      }
    />
  );
}
