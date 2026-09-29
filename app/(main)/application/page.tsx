import type { Metadata } from "next"

import { LoadApplicationPageProps } from "@/presentation/routes/application/helpers/load-application-page-props.helper"
import { ApplicationList } from "@/presentation/routes/application/pages/list"

export const metadata: Metadata = {
  title: "Aplicações",
}

export default async function ApplicationRoutePage() {
  const PROPS = await LoadApplicationPageProps()

  return <ApplicationList {...PROPS} />
}