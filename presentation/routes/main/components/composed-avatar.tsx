import { Avatar, AvatarImage, AvatarFallback } from "@/presentation/ui/avatar"

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

import { IconSelector } from "@tabler/icons-react"

function ComposedAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer"
        nativeButton={false}
        render={
          <div className="flex h-full w-full flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-normal text-foreground">
                Moisés Reis
              </span>
            </div>
            <IconSelector className="size-4 text-muted-foreground" />
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
        <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ComposedAvatar }
