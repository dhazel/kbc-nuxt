# AGENTS.md

## Build, Lint, and Test Commands

- **Build**: `npm run build` - Compiles the Nuxt application for production.
- **Lint**: `npm run lint` - Runs ESLint on the codebase to ensure code quality.
- **Test**: `npm run test` - Executes the full test suite using Vitest.
- **Single Test**: `npm run test -- <path/to/test/file>` - Runs a specific test file with Vitest.

## Code Style Guidelines

- **Imports**: Use ES module syntax; group imports by source (standard, third-party, local).
- **Formatting**: Follow Prettier defaults with 2-space indentation; use single quotes.
- **Types**: Use TypeScript with strict typing; avoid `any` unless necessary.
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types.
- **Error Handling**: Use try-catch for async operations; log errors with context.
- **Components**: Follow Nuxt conventions for Vue components in `pages/` and `components/`.
- **File Structure**: Organize files per Nuxt standards (pages, components, composables).

## Additional Rules

- **Cursor/Copilot**: No specific rules found in .cursor/rules or .github/copilot-instructions.md.
- **Commit Style**: Use descriptive commit messages in present tense (e.g., 'Add feature X').
- **PR Guidelines**: Ensure PRs are small, focused, and include a test plan.
