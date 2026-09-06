import Image from "next/image"
import BackgroundOne from "@/public/Background_1.svg"
import BackgroundTwo from "@/public/Background_2.svg"
import BackgroundThree from "@/public/Background_3.svg"
import { BRAND } from "@/presentation/constants/brand.constants"
import type { ReactNode } from "react"

interface AuthShellProps {
  children: ReactNode
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {BRAND.COMPANY_NAME}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={BackgroundOne}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}