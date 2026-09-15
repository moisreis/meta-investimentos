import type { NextConfig } from "next";

// Stores the application configuration.
const nextConfig: NextConfig = {
  devIndicators: false
};

/**
 * @summary
 * Exports the **Next.js** application configuration.
 *
 * @remarks
 * The configuration is empty and uses the **NextConfig** type.
 * Add application settings to the configuration object.
 *
 * @explanation
 * This export lets **Next.js** load application settings.
 * It is used in the project root as the main config file.
 * Add settings here when the application needs customization.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export default nextConfig;
