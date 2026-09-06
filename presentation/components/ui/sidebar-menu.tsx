import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/presentation/components/ui/button";

type SidebarMenuButtonProps = ComponentProps<typeof Button> & {
  icon?: IconSvgElement;
  label: string;
  link: string;
  children?: ReactNode;
};

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
  label,
  className,
  ...props
}: ComponentProps<"span"> & { label: string }) {
  return (
    <span
      className={cn(
        "text-xs font-normal text-muted-foreground dark:text-neutral-500 uppercase tracking-wide",
        className,
      )}
      {...props}
    >
      {label}
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
  icon: Icon,
  label,
  link,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const pathname = usePathname();
  const active = pathname === link;

  return (
    <Button
      variant="ghost"
      render={<Link href={link} />}
      className={cn("w-full justify-start", className)}
      data-active={active || undefined}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 overflow-hidden",
          !active && "text-muted-foreground",
        )}
      >
        {Icon && (
          <HugeiconsIcon
            icon={Icon}
            strokeWidth={2}
            aria-hidden="true"
            className="mr-1.5 !size-4"
          />
        )}
        <span className="truncate">{label}</span>
      </span>
    </Button>
  );
}

export {
  SidebarMenu,
  SidebarMenuLabel,
  SidebarMenuButtonGroup,
  SidebarMenuButton,
};
