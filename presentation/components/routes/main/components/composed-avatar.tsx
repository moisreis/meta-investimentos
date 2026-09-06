import type { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  ChevronsLeftRightIcon,
  EditUser02Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useCurrentUser } from "@/presentation/hooks/auth/use-current-user.hook";
import { Badge } from "@/presentation/components/ui/badge";

export default function ComposedAvatar({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  const { FULL_NAME, INITIAL } = useCurrentUser();

  return (
    <DropdownMenu>
      <div className="flex flex-row items-center justify-start h-11 px-3">
        <DropdownMenuTrigger
          className={cn(
            "flex flex-row items-center justify-between w-full gap-2 h-7 px-1.5 rounded-md outline-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px",
            className,
          )}
          {...props}
        >
          <div className="flex flex-row justify-start items-center gap-2">
            <Avatar className="h-4 w-4">
              <AvatarImage
                src="/avatar.png"
                alt="Avatar"
              />
              <AvatarFallback>{INITIAL}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{FULL_NAME}</span>
          </div>
          <HugeiconsIcon
            icon={ChevronsLeftRightIcon}
            strokeWidth={2}
            aria-hidden="true"
            className="!size-3 rotate-90 text-muted-foreground"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        className="w-40"
      >
        <DropdownMenuItem>
          <HugeiconsIcon
            icon={EditUser02Icon}
            strokeWidth={2}
          />
          Editar perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2}
          />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
