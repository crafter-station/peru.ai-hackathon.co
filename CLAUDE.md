# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `bun i` - Install dependencies
- `bun dev` - Start development server with Next.js and Turbopack
- `next build` - Build production version
- `next start` - Start production server
- `next lint` - Run ESLint

### Package Manager
This project uses **Bun** as the package manager, not npm or yarn. Always use `bun` commands for package management.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom utilities
- **UI Components**: Radix UI primitives with shadcn/ui components (New York variant)
- **Themes**: next-themes (forced dark theme)
- **Fonts**: Custom Adelle Mono, Geist Sans/Mono, and Adobe TypeKit fonts
- **Analytics**: Vercel Analytics
- **AI Integration**: FAL AI for image generation using nano-banana/edit model

### Core Features
1. **Landing Page**: IA Hackathon Peru 2025 marketing site
2. **Text-to-Alpaca Generator**: AI-powered alpaca image customization using a base alpaca image and brand preservation prompts

### Project Structure
```
app/
├── api/generate-image/     # FAL AI image generation endpoint
├── text-to-alpaca/         # Alpaca generator page
├── layout.tsx              # Root layout with fonts and providers
└── page.tsx                # Main landing page

components/
├── navigation/             # Floating navigation
├── providers/              # Theme and client providers
├── sections/               # Landing page sections (hero, footer, etc.)
├── text-to-alpaca/         # Alpaca generator components
└── ui/                     # shadcn/ui components

hooks/
├── use-image-generation.ts # Image generation logic and state
├── use-rate-limit.ts       # Rate limiting for API calls
└── use-media-query.ts      # Responsive breakpoint detection

lib/
├── constants/prompts.ts    # Random prompt library for alpaca generation
└── utils.ts                # Utility functions and Tailwind merge
```

### Key Architectural Patterns

#### Image Generation Flow
The alpaca generator uses a brand-preserving AI workflow:
1. User submits prompt via `/text-to-alpaca` form
2. API route `/api/generate-image` enhances prompt with brand preservation instructions
3. Uses FAL AI's nano-banana/edit model with base alpaca image (`IA-HACK-PE-LLAMA.png`)
4. Returns generated image while preserving original branding and visual identity

#### Rate Limiting
- Uses local storage-based rate limiting (`use-rate-limit.ts`)
- Limits users to prevent API abuse
- Graceful degradation with user-friendly messages

#### Component Architecture
- Server components by default, client components marked with "use client"
- Compound component patterns for complex UI (InputForm, ImageDisplay, LoadingSection)
- Radix UI primitives with custom styling via `cva` (class-variance-authority)

#### Environment Configuration
- FAL AI API key required: `FAL_API_KEY`
- Next.js image optimization configured for external AI image domains
- Theme provider forces dark mode globally

### Development Notes

#### Brand Guidelines
When working with the alpaca generator, the system includes strict brand preservation prompts to maintain the original IA Hackathon Peru branding, logos, and visual identity in generated images.

#### Responsive Design
Components use mobile-first responsive design with Tailwind breakpoints. Pay attention to `sm:` prefixes throughout the codebase.

#### TypeScript Configuration
- Strict mode enabled
- Path aliases configured: `@/*` maps to root directory
- Bundler module resolution for optimal performance