import type { Metadata } from "next";

import { SignUpPage } from "@/presentation/components/routes/auth/pages/sign-up.page";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function Page() {
  return <SignUpPage />;
}
