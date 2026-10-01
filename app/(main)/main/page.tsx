import type { Metadata } from "next"

import { MainDetail } from "@/presentation/routes/main/pages/detail"

export const metadata: Metadata = {
  title: "Painel",
}

/**
 * @summary
 * Route page of the main shell home.
 *
 * @remarks
 * The home reads no data, so the route only names the
 * screen and hands it to the shell layout. Every
 * authenticated screen renders inside `app/(main)`, and
 * the home is the one the shell opens on.
 *
 * @returns The route page of the home.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default function MainHomeRoutePage() {
  return <MainDetail />
}
