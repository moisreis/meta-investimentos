import { auth } from "@/clients/better-auth.client"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest): Promise<Response> {
  return auth.handler(request)
}

export async function POST(request: NextRequest): Promise<Response> {
  return auth.handler(request)
}
