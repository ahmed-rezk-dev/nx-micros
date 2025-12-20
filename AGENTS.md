# AGENTS.md - Nx Microfrontends Development Guidelines

## Build/Lint/Test Commands

- **Build**: `nx build <project-name>` (e.g., `nx build shell`)
- **Test**: `nx test <project-name>` (e.g., `nx test ui`)
- **Single test**: `nx test <project-name> --testPathPattern=<filename>`
- **Lint**: `nx lint <project-name>` (e.g., `nx lint ui`)
- **Typecheck**: `nx typecheck <project-name>` (e.g., `nx typecheck ui`)
- **Serve**: `nx serve <project-name>` (shell: port 4200, auth: port 4201)
- **Post-change verification**: Run `nx typecheck ui && nx lint ui && nx test ui`

## Code Style Guidelines

- **Formatting**: Prettier with single quotes, auto-format with `nx format:write`
- **TypeScript**: Strict mode enabled, NodeNext modules, no unused locals/implicit returns
- **Imports**: `import * as React from 'react'`, named imports, group by React/third-party/local
- **Naming**: Functions camelCase, Components PascalCase, files kebab-case, tests `.spec.tsx`
- **Error handling**: TypeScript strict mode, proper async error boundaries
- **Module boundaries**: Respect `@nx/enforce-module-boundaries` rules
- **Testing**: React Testing Library with Jest, wrap routing in `BrowserRouter`
- **Architecture**: Microfrontends with Module Federation, React 19, Tailwind CSS, Rspack
- **Components**: Atomic design (atoms → molecules → organisms → templates → pages)

## Git Guidelines

- Never commit without fixing all errors or confirming commit message with user</content>
  <parameter name="filePath">/Users/ahmed.rezk/exercising/nx-micros/AGENTS.md
