import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/presentation/components/ui/button";

function SidebarMenu({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col justify-start items-start w-full gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarMenuLabel({
  children,
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-xs font-normal text-muted-foreground dark:text-neutral-500 uppercase tracking-wide",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function SidebarMenuButtonGroup({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-start items-start gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarMenuButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn("w-full justify-start", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export {
  SidebarMenu,
  SidebarMenuLabel,
  SidebarMenuButtonGroup,
  SidebarMenuButton,
};
