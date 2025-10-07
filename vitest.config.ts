import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineVitestProject(
    ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], // Glob pattern for your test files
    () => defineConfig({
        test: {
            environment: 'nuxt'
        }
    })
)
