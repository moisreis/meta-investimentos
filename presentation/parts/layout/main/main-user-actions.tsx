import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

import { Badge } from "@/presentation/ui/badge"

import { SharedUserAvatar } from "@/presentation/parts/components/shared-user-avatar"
import type { UserIdentity } from "@/presentation/types/user-identity.types"

import { IconSelector } from "@tabler/icons-react"

interface MainUserActionsProps {
  // The signed-in user naming the account menu, or `null`
  // while the profile cannot be resolved. The menu stays
  // available either way: signing out has to remain
  // reachable when the name behind it is missing.
  user: UserIdentity | null
}

/**
 * @summary
 * Renders the account menu of the sidebar header.
 *
 * @remarks
 * The trigger names the signed-in user through the shared
 * avatar part, so the picture and the name read the same way
 * here and on a detail screen. Without a resolved profile the
 * identity block is dropped and the menu keeps the chevron
 * alone, which is a quieter shape than a row of placeholder
 * initials pretending to be a person.
 *
 * @param props - Props of the account menu.
 * @param props.user - The signed-in user, or `null`.
 *
 * @returns The account menu.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function MainUserActions({ user }: MainUserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer"
        nativeButton={false}
        render={
          <div className="flex h-full w-full flex-row items-center justify-between gap-2">
            {user ? (
              <SharedUserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                image={user.image}
                className="min-w-0 [&>span]:min-w-0 [&>span]:truncate"
              />
            ) : null}
            <IconSelector className="size-4 shrink-0 text-muted-foreground" />
          </div>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Acessos{" "}
          <Badge variant="outline" className="rounded-full">
            Em breve
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { MainUserActions }
