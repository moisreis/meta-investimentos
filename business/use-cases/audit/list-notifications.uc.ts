import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";

import type { NotificationDto } from "./audit.dtos";
import { toNotificationDto } from "./audit.mapper";

/**
 * The default time window covered by the notification feed.
 */
const NOTIFICATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The default maximum number of notifications returned.
 */
const DEFAULT_LIMIT = 20;

/**
 * Input for {@link listNotifications}.
 */
export interface ListNotificationsInput {
  /**
   * The id of the user whose audit activity feeds the notifications.
   */
  actorId: string;

  /**
   * The earliest action timestamp to include, or `undefined` to cover
   * the last seven days.
   */
  since?: Date;

  /**
   * The maximum number of notifications to return (defaults to `20`).
   */
  limit?: number;
}

/**
 * Lists the recent audit-registered notifications of the acting user.
 *
 * The feed is scoped to the acting user's own audit trail: every row the
 * `audit_log` table recorded with the user as the acting `userId` (for
 * example portfolio mutations, access grants, or profile updates) is a
 * candidate notification. Entries are filtered to the {@link
 * ListNotificationsInput.since} window, ordered most recent first, and
 * capped at {@link ListNotificationsInput.limit}.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor id and optional feed parameters.
 * @returns The ordered collection of {@link NotificationDto}.
 */
export async function listNotifications(
  unitOfWork: UnitOfWork,
  input: ListNotificationsInput,
): Promise<NotificationDto[]> {
  const ACTOR_ID: EntityId = EntityId.create(input.actorId);
  const SINCE = input.since ?? new Date(Date.now() - NOTIFICATION_WINDOW_MS);
  const LIMIT = input.limit ?? DEFAULT_LIMIT;

  return unitOfWork.run(async (tx) => {
    const LOGS = await tx.auditLogs.findAllByUserId(ACTOR_ID);

    return LOGS.filter((LOG) => LOG.createdAt >= SINCE)
      .sort((A, B) => B.createdAt.getTime() - A.createdAt.getTime())
      .slice(0, LIMIT)
      .map((LOG) => toNotificationDto(LOG));
  });
}
