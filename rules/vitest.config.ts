import { defineConfig } from 'vitest/config'

export default defineConfig({
  // The package has no source maps for its published dist, only harmless "missing source" warnings.
  logLevel: 'error',
  test: {
    // @gamepark/rules-api re-exports via directory imports (no "exports" map in its package.json),
    // which Node's own ESM resolver can't follow. Let Vite process (inline) it instead of treating
    // it as an untouched external dependency, the same way `vite build` in the app package already does.
    server: {
      deps: {
        inline: [/@gamepark\/rules-api/]
      }
    }
  }
})
