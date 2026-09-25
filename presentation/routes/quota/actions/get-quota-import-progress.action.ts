"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"

import type { QuotaImportProgress } from "../types/quota-list.types"
import { getQuotaImportJob } from "./quota-import-job.store"

export interface GetQuotaImportProgressActionInput {
  jobId: string
}

/**
 * @summary
 * Returns the current snapshot of a quota import job.
 *
 * @remarks
 * Resolves the session user and reads the in-memory job
 * by id. Returns null when there is no active session or
 * the job no longer exists.
 *
 * @explanation
 * Use as the polling target of the quota import progress
 * dialog.
 *
 * @param input - The job id to read.
 *
 * @returns The job snapshot, or `null`.
 *
 * @example
 * const JOB = await getQuotaImportProgressAction({
 *   jobId: "job-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function getQuotaImportProgressAction(
  input: GetQuotaImportProgressActionInput
): Promise<QuotaImportProgress | null> {
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  return getQuotaImportJob(input.jobId)
}
