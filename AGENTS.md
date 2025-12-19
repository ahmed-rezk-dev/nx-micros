# AGENTS.md - Development Guidelines for Nx Microfrontends

## Package Management

- **Root package.json**: Serves as the main center shared package manager for the entire monorepo
- **Workspaces**: Configured with npm workspaces for `packages/*`, `apps/*`, and `apps/mfe/*` directories
- **Dependencies**: All shared dependencies (React, React Router, Module Federation, etc.) are managed centrally

## Build/Lint/Test Commands

### Individual Project Commands

- **Build**: `nx build <project-name>` (e.g., `nx build shell`, `nx build auth`)
- **Test**: `nx test <project-name>` (e.g., `nx test shell`)
- **Lint**: `nx lint <project-name>` (e.g., `nx lint shell`)
- **Typecheck**: `nx typecheck <project-name>` (e.g., `nx typecheck shell`)
- **Serve**: `nx serve <project-name>` (shell: port 4200, auth: port 4201)

### Run Single Test

- Run all tests for a project: `nx test <project-name>`
- Run specific test file: `nx test <project-name> --testPathPattern=<filename>`
- Run tests in watch mode: `nx test <project-name> --watch`

### Multiple Targets

- Run build, test, and lint together: `nx run-many -p <project-name> -t build test lint typecheck`

### Post-Change Verification

- Always run `nx typecheck ui && nx lint ui && nx test ui` after making changes to ensure code quality

### Documentation Maintenance

- Always keep README.md up to date with guidelines, structure, onboarding instructions, scripts, and documentation

## Code Style Guidelines

### Formatting

- Use Prettier with single quotes (`singleQuote: true`)
- Auto-format with: `nx format:write`

### TypeScript Configuration

- **Strict mode**: Enabled with comprehensive type checking
- **Unused variables**: `noUnusedLocals` enabled
- **Implicit returns**: `noImplicitReturns` enabled
- **Fallthrough cases**: `noFallthroughCasesInSwitch` enabled
- **Module resolution**: Uses NodeNext for modern ESM support

### Import Conventions

- React: `import * as React from 'react'`
- Named imports for other libraries
- Group imports: React/React DOM, third-party libraries, local imports

### Naming Conventions

- **Functions**: camelCase (e.g., `export function App()`)
- **Components**: PascalCase (e.g., `NxWelcome`)
- **Files**: kebab-case for filenames (e.g., `app.tsx`, `nx-welcome.tsx`)
- **Test files**: `.spec.tsx` suffix

### Error Handling

- Leverage TypeScript strict mode for compile-time error detection
- Use proper typing to prevent runtime errors
- Handle async operations with proper error boundaries

### Module Boundaries

- Nx enforces `@nx/enforce-module-boundaries` - respect project dependencies
- Import only from allowed sources per project configuration

### Testing Patterns

- Use React Testing Library with Jest
- Wrap routing components in `BrowserRouter` for tests
- Test files: `<component>.spec.tsx`
- Use descriptive test names and assertions

### Architecture Notes

- Microfrontends using Module Federation
- React 19 with React Router DOM
- Tailwind CSS for styling
- Rspack bundler

### Component Architecture

- Follow atomic design: atoms (buttons), molecules (forms), organisms (complex components)

### Git Commit Guidelines

- Never commit without fixing all errors
- Never commit without confirming the commit message with the user: provide options yes, no, edit</content>
  <parameter name="filePath">/Users/ahmed.rezk/exercising/nx-micros/AGENTS.md
