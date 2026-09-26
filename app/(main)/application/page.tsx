import type { Metadata } from "next"

import { BuildApplicationLookups } from "@/presentation/routes/application/helpers/build-application-lookups.helper"
import { EMPTY_APPLICATION_LOOKUPS } from "@/presentation/routes/application/helpers/build-application-lookups.helper"
import { LoadApplications } from "@/presentation/routes/application/helpers/load-applications.helper"
import { ApplicationList } from "@/presentation/routes/application/pages/list"
import type { ApplicationLookups } from "@/presentation/routes/application/types/application-list.types"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

export const metadata: Metadata = {
  title: "Aplicações",
}

export default async function ApplicationRoutePage() {
  let APPLICATIONS: ApplicationResponseDTO[] | null = null
  let LOOKUPS: ApplicationLookups = EMPTY_APPLICATION_LOOKUPS

  const LOADED = await LoadApplications()

  if (LOADED) {
    APPLICATIONS = LOADED.applications
    LOOKUPS = BuildApplicationLookups(LOADED)
  }

  return (
    <ApplicationList data={APPLICATIONS} lookups={LOOKUPS} />
  )
}
