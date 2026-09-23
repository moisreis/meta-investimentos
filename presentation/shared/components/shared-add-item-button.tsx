import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/presentation/ui/button";
import type { JSX } from "react";

export interface SharedAddItemButtonProps {
  onClick?: () => void;
}

/**
 * @summary
 * Renders an add item button.
 *
 * @remarks
 * Uses a ghost variant with muted text styling.
 *
 * @explanation
 * Encapsulates the shared UI button for adding items.
 *
 * @param props - Component configuration props.
 *
 * @returns JSX Element.
 *
 * @example
 * const BUTTON = <SharedAddItemButton />;
 *
 * @author Moisés Reis
 *
 * @date 2026-09-18
 */
export function SharedAddItemButton(
  props: SharedAddItemButtonProps,
): JSX.Element {
  const { onClick } = props;

  return (
    <Button
      variant="ghost"
      className="font-normal text-muted-foreground"
      onClick={onClick}
    >
      <IconPlus />
      <span>Adicionar Item</span>
    </Button>
  );
}
