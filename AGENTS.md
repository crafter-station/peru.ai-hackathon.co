# AGENTS.md - Coding Agent Guidelines

## Build/Lint/Test Commands
- **Package Manager**: Use `bun` (NOT npm/yarn) - `bun i`, `bun dev`, `bun add <pkg>`
- **Dev Server**: `bun dev` (Next.js 15 with Turbopack)
- **Build**: `next build` (production build)
- **Lint**: `next lint` (ESLint with next/core-web-vitals)
- **Tests**: No test framework configured - do NOT assume Jest/Vitest exists

## Code Style Guidelines

### Imports & Path Aliases
- Use `@/*` for imports (e.g., `import { cn } from "@/lib/utils"`)
- Group imports: React first, then third-party, then local (`@/*`)
- Use named imports for utilities, default for components

### TypeScript & Types
- **Strict mode enabled** - all code must type-check
- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes
- Use `Type | null` over `Type | undefined` for nullable values

### Naming Conventions
- **Files**: kebab-case (e.g., `use-image-generation.ts`, `chat-bubble.tsx`)
- **Components**: PascalCase function declarations (e.g., `function Button()`)
- **Hooks**: camelCase with `use` prefix (e.g., `useImageGeneration`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `UNSAFE_MESSAGES`)

### Component Patterns
- Server components by default, add `"use client"` directive when needed
- Use compound patterns with Radix UI primitives
- Style with Tailwind CSS v4 - use `cn()` utility for conditional classes
- Use `cva` (class-variance-authority) for component variants

### Error Handling
- Use try/catch for async operations with user-facing errors
- Console.warn for non-critical failures (e.g., gallery save failures)
- Return user-friendly Spanish error messages for this project
- Never expose API keys or internal error details to users

### AI/API Integration
- FAL AI for image generation - always preserve brand guidelines in prompts
- Check safety with guardrail API before generation
- Show progress UI during long operations
- Preload images before displaying to users
