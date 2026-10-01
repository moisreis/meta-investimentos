import { MainHome } from "@/presentation/parts/layout/main/main-home"
import { MAIN_HOME } from "../settings/labels.settings"

/**
 * @summary
 * Renders the home of the main shell.
 *
 * @remarks
 * The home is not a collection, so it takes the detail
 * slot of the route contract rather than the list one.
 * It holds no data of its own and composes the shell
 * launchpad, which is why it can render on the server.
 *
 * @returns The home screen of the main shell.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function MainDetail() {
  return <MainHome copy={MAIN_HOME} />
}

export { MainDetail }
