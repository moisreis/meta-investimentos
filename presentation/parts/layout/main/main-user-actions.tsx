"use client"

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
import { useMainSignOut } from "@/presentation/parts/hooks/use-main-sign-out.hook"
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
 * Renders an account menu entry that is not shipped yet.
 *
 * @remarks
 * Disabled and tagged with the `Em breve` badge, so every
 * placeholder entry of the menu reads the same way instead
 * of restating the badge per item.
 *
 * @param props - Props of the placeholder entry.
 * @param props.children - The entry label.
 *
 * @returns The disabled placeholder entry.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function ComingSoonItem({ children }: { children: string }) {
  return (
    <DropdownMenuItem disabled>
      {children}{" "}
      <Badge variant="outline" className="rounded-full">
        Em breve
      </Badge>
    </DropdownMenuItem>
  )
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
 * Every entry past the label is still unshipped, so they are
 * disabled and tagged `Em breve`; only signing out is wired,
 * which sends the browser to the sign-in route.
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
  const { signOut, pending } = useMainSignOut()

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
          <ComingSoonItem>Perfil</ComingSoonItem>
          <ComingSoonItem>Configurações</ComingSoonItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ComingSoonItem>Acessos</ComingSoonItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onClick={() => void signOut()}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { MainUserActions }
