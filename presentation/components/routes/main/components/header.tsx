"use client";

import {
  ChevronRightIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import { useBreadcrumb } from "@/presentation/hooks/navigation/use-breadcrumb.hook";
import { useNotifications } from "@/presentation/hooks/notifications/use-notifications.hook";
import {
  type SystemHealthStatus,
  useSystemHealth,
} from "@/presentation/hooks/system/use-system-health.hook";

type HeaderProps = {
  activeTab: string;
};

const HEALTH_DOT_COLORS: Record<SystemHealthStatus, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

const STATUS_LABELS: Record<SystemHealthStatus, string> = {
  healthy: "Operacional",
  degraded: "Atenção",
  down: "Indisponível",
};

const ACTION_LABELS: Record<string, string> = {
  CREATED: "criado",
  UPDATED: "atualizado",
  DELETED: "removido",
  READ: "visto",
};

const ACTION_DOT_COLORS: Record<string, string> = {
  CREATED: "bg-emerald-500",
  UPDATED: "bg-amber-500",
  DELETED: "bg-red-500",
  READ: "bg-sky-500",
};

/**
 * Describes an audit action in the notification feed.
 *
 * @param action - The raw audit action, e.g. `"CREATED"`.
 * @returns The Portuguese description, e.g. `"criado"`.
 */
function describeAction(action: string): string {
  return ACTION_LABELS[action] ?? action.toLowerCase();
}

/**
 * Formats a timestamp as a relative, human-readable label.
 *
 * @param iso - The ISO 8601 timestamp to format.
 * @returns A relative label such as `"há 5 min"` or a localized date
 * for entries older than a week.
 */
function formatRelativeTime(iso: string): string {
  const DIFF_MS = Date.now() - new Date(iso).getTime();
  const MINUTES = Math.floor(DIFF_MS / 60_000);

  if (MINUTES < 1) return "agora mesmo";
  if (MINUTES < 60) return `há ${MINUTES} min`;

  const HOURS = Math.floor(MINUTES / 60);
  if (HOURS < 24) return `há ${HOURS} h`;

  const DAYS = Math.floor(HOURS / 24);
  if (DAYS <= 7) return `há ${DAYS} dia${DAYS > 1 ? "s" : ""}`;

  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function Header({ activeTab }: HeaderProps) {
  const SEGMENTS = useBreadcrumb(activeTab);
  const { STATUS, CHECKS } = useSystemHealth();
  const { NOTIFICATIONS, COUNT, IS_LOADING, REFRESH } = useNotifications();
  const [NOTIFICATION_OPEN, SET_NOTIFICATION_OPEN] = useState(false);

  return (
    <header className="h-11 shrink-0 border-b border-border bg-background px-2 flex items-center justify-between transition-colors duration-200">
      <nav
        aria-label="Trilha de navegação"
        className="flex items-center h-7 min-w-0"
      >
        <ol className="flex items-center gap-1 text-sm font-normal">
          {SEGMENTS.map((segment, index) => (
            <Fragment key={`${segment.label}-${index}`}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="flex items-center text-muted-foreground"
                >
                  <HugeiconsIcon
                    icon={ChevronRightIcon}
                    strokeWidth={2}
                    className="!size-3.5"
                  />
                </li>
              )}
              <li className="flex items-center">
                {segment.href ? (
                  <Link
                    href={segment.href}
                    className="rounded-md px-1 py-0.5 text-muted-foreground transition-colors duration-200 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:bg-muted/50"
                  >
                    {segment.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={cn(
                      "px-1 py-0.5",
                      index === SEGMENTS.length - 1
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {segment.label}
                  </span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-2 h-7">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className="gap-2 rounded-md px-2.5 py-1 text-muted-foreground text-sm transition-colors duration-200 hidden sm:flex"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  STATUS ? HEALTH_DOT_COLORS[STATUS] : "bg-muted-foreground",
                )}
              />
              <span>Saúde do sistema</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {STATUS === null ? (
              <p>Verificando...</p>
            ) : (
              <div className="flex flex-col gap-1">
                {CHECKS.map((check) => (
                  <p
                    key={check.name}
                    className="flex items-center gap-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        HEALTH_DOT_COLORS[check.status],
                      )}
                    />
                    {check.name}: {STATUS_LABELS[check.status]}
                    {check.message ? ` — ${check.message}` : ""}
                  </p>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>

        <div
          aria-hidden="true"
          className="h-[18px] w-px bg-border hidden sm:block"
        />

        <DropdownMenu
          open={NOTIFICATION_OPEN}
          onOpenChange={(open) => {
            SET_NOTIFICATION_OPEN(open);
            if (open) {
              void REFRESH();
            }
          }}
        >
          <DropdownMenuTrigger
            aria-label={COUNT > 0 ? `Notificações (${COUNT})` : "Notificações"}
            className="relative flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 outline-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:bg-muted/50"
          >
            <HugeiconsIcon
              icon={Notification01Icon}
              strokeWidth={2}
              aria-hidden="true"
              className="!size-4"
            />
            {COUNT > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-white">
                {COUNT > 9 ? "9+" : COUNT}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0"
          >
            <DropdownMenuLabel className="px-3 py-2 text-sm font-medium">
              Notificações
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto py-1">
              {IS_LOADING ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Carregando...
                </p>
              ) : NOTIFICATIONS.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nenhuma notificação recente.
                </p>
              ) : (
                NOTIFICATIONS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2.5 px-3 py-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        ACTION_DOT_COLORS[item.action] ?? "bg-muted-foreground",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">
                        {item.entity} {describeAction(item.action)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
