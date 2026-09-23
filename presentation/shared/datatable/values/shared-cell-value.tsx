"use client"

import { IconSelector } from "@tabler/icons-react"
import { cn } from "cn"

import { Avatar, AvatarImage, AvatarFallback } from "@/presentation/ui/avatar"

import { TEXT_LINE_CLAMP_CLASS } from "@/presentation/presenters/text.presenter"

/**
 * Renders a clamped, truncated text value inside a data-table cell.
 */
export function SharedTextValue({ text }: { text: string }) {
  return <div className={cn(TEXT_LINE_CLAMP_CLASS, "min-w-0")}>{text}</div>
}

/**
 * Renders a right-aligned percentage value inside a data-table cell.
 */
export function SharedPercentageValue({ text }: { text: string }) {
  return <div className="flex w-full justify-end">{text}</div>
}

/**
 * Renders a date value inside a data-table cell.
 */
export function SharedDateValue({ text }: { text: string }) {
  return <span>{text}</span>
}

/**
 * Renders a user identity (avatar, name and selector affordance) inside a
 * data-table cell. Mirrors the composed-avatar trigger markup.
 */
export function SharedUserAvatar({
  name = "Moisés Reis",
  avatarUrl = "https://github.com/shadcn.png",
  fallback = "CN",
}: {
  name?: string
  avatarUrl?: string
  fallback?: string
}) {
  return (
    <div className="flex h-full w-full flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <Avatar className="size-5">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-normal text-foreground">{name}</span>
      </div>
    </div>
  )
}