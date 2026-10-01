import {
  IconAlertCircle,
  IconCircleCheck,
  IconLoader,
} from "@tabler/icons-react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/presentation/ui/marker"

import type { ComponentPropsWithoutRef, ReactNode } from "react"

/**
 * The states a job reports while it runs and once it stops.
 *
 * @remarks
 * Named for what the job is doing rather than for its colour,
 * so a caller says `status="error"` and the marker decides
 * what that looks like. The four tones are fixed here because
 * a job that failed must never read as one that succeeded, and
 * a spinner that stopped spinning must be visibly not running.
 */
export type EntityJobTone =
  "running" | "success" | "error" | "warning"

// Icon and emphasis of each tone. Running spins, so it is the
// only tone that carries an animation; the rest are settled
// states and a moving icon would misreport them.
const TONE: Record<
  EntityJobTone,
  {
    readonly Icon: typeof IconLoader
    readonly className: string
  }
> = {
  running: { Icon: IconLoader, className: "animate-spin" },
  success: { Icon: IconCircleCheck, className: "text-primary" },
  error: {
    Icon: IconAlertCircle,
    className: "text-destructive",
  },
  warning: {
    Icon: IconAlertCircle,
    className: "text-muted-foreground",
  },
}

interface EntityStatusMarkerProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  // The job state to report.
  tone: EntityJobTone

  // The text the marker reports.
  children: ReactNode
}

/**
 * @summary
 * Renders one line of job status with its icon.
 *
 * @remarks
 * A polled job reports through a small set of lines: it is
 * running, it finished, it failed, or it finished with
 * something left out. Each line carries an icon whose colour
 * says how seriously to take it, and getting that pairing
 * right in three dialogs is three chances to get it wrong.
 *
 * Putting the icon and its colour together here means the
 * pairing is decided once. A failure is destructive wherever it
 * appears, a success reads as primary, and a caveat about
 * skipped work stays muted so it does not compete with the
 * outcome it qualifies.
 *
 * Only the running tone animates. A spinner is a claim that
 * something is still moving, so it must stop when the job does.
 *
 * @explanation
 * Use for every status line of a job progress dialog. Pass the
 * tone and the text; the marker owns the icon and the emphasis.
 *
 * @param props - Props of the status marker.
 * @param props.tone - The job state to report.
 * @param props.children - The text the marker reports.
 *
 * @returns The status marker.
 *
 * @example
 * <EntityStatusMarker tone="error">
 *   {QUOTA_IMPORT.ERROR_DESCRIPTION}
 * </EntityStatusMarker>
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityStatusMarker({
  tone,
  children,
  ...props
}: EntityStatusMarkerProps) {
  const { Icon, className } = TONE[tone]

  return (
    <Marker {...props}>
      <MarkerIcon>
        <Icon className={className} />
      </MarkerIcon>
      <MarkerContent>{children}</MarkerContent>
    </Marker>
  )
}

export { EntityStatusMarker }
