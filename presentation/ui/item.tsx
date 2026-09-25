import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * @summary
 * Layout primitives for structured list items.
 *
 * @remarks
 * Plain presentational wrappers used to compose rich
 * options inside pickers such as comboboxes. They add
 * no behavior, so they can be nested inside any
 * interactive list element without side effects.
 *
 * @explanation
 * `Item` lays the media, content and actions in a row.
 * `ItemContent` stacks the title and the description.
 * Use `size="xs"` for rows rendered inside data
 * pickers, where compactness matters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */

const itemVariants = cva(
  "group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
        xs: "gap-2 px-1.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

const itemMediaVariants = cva("bg-transparent", {
  variants: {
    type: {
      icon: "size-8 rounded-sm border border-transparent bg-muted p-1.5",
      image:
        "size-10 overflow-hidden rounded-sm border border-transparent",
    },
  },
  defaultVariants: {
    type: "icon",
  },
})

function ItemMedia({
  className,
  type,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      className={cn(itemMediaVariants({ type }), className)}
      {...props}
    />
  )
}

function ItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

function ItemHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
}
