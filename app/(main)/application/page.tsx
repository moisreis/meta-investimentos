import type { Metadata } from "next"

import { LoadApplicationPageProps } from "@/presentation/routes/application/helpers/load-application-page-props.helper"
import { ApplicationList } from "@/presentation/routes/application/pages/list"

export const metadata: Metadata = {
  title: "Aplicações",
}

/**
 * @summary
 * Route page of the application list screen.
 *
 * @remarks
 * Loads the props of the screen on the server, so the
 * first paint already carries the data, and hands them
 * to the route page that composes the screen. The page
 * itself only decides the title and the entry point, so
 * the same route page can be rendered from anywhere.
 *
 * @returns The route page of the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export default async function ApplicationRoutePage() {
  const PROPS = await LoadApplicationPageProps()

  return <ApplicationList {...PROPS} />
}
