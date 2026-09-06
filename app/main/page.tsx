import type { Metadata } from "next";
import MainDashboard from "@/presentation/components/routes/main/pages/main.page";

export const metadata: Metadata = {
  title: "Início",
};

/**
 * The application main page.
 *
 * Reached after a successful sign-in or when an authenticated user visits an
 * authentication route. The middleware protects it, so only authenticated
 * users can render it.
 */
export default function MainPage() {
  return (
    <MainDashboard />
  );
}
