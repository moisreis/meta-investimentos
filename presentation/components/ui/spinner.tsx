import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { cn } from "cn";

function Spinner({ className, ...props }: Omit<HugeiconsIconProps, "icon">) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      data-slot="spinner"
      strokeWidth={2}
      className={cn("animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
