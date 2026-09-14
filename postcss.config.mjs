// Stores the **PostCSS** configuration.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

/**
 * @summary
 * Exports the **PostCSS** configuration.
 *
 * @remarks
 * The config enables the **Tailwind CSS** **PostCSS** plugin.
 * The plugin uses its default configuration.
 *
 * @explanation
 * This config enables **Tailwind CSS** during CSS processing.
 * It registers the plugin in the **PostCSS** config object.
 * Use it when the project processes **Tailwind CSS** styles.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export default config;
