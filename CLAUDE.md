# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Emo Copy Generator - A React Router application that generates emotional copy text using AI. The app creates short stories and derives marketing copy from them based on product information and brand images.

## Tech Stack

- **Framework**: React Router v7 with SSR enabled
- **UI**: React with TypeScript, TailwindCSS v4, Radix UI components
- **AI Integration**: Vercel AI SDK with support for Google Gemini and OpenAI
- **Database**: LibSQL/Turso with Kysely ORM
- **Build**: Vite with React Router plugin
- **Deployment**: Vercel-optimized with Docker support

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with HMR on http://localhost:5173

# Building
pnpm build            # Production build

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Check Prettier formatting
pnpm format:fix       # Fix formatting issues
pnpm typecheck        # Run TypeScript type checking
pnpm validate         # Run all checks (format, lint, typecheck) in parallel

# Database
pnpm kysely:codegen   # Generate Kysely types from database schema
```

## Architecture

### Route Structure

- `/` - Main page with generation form and results display (app/routes/index/route.tsx)
- `/api` - AI generation endpoint handling streaming responses (app/routes/api.ts)

### Core Components

- **Generation Form**: Uses Conform for form validation with Zod schemas
- **AI Integration**: Streaming object generation with provider abstraction (Google/OpenAI)
- **Database**: Generation logs stored in LibSQL with Kysely for type-safe queries

### Key Patterns

1. **Form Handling**: Conform + Zod for type-safe form validation
2. **AI Streaming**: useObject hook for real-time streaming responses
3. **Error Handling**: Structured error display with fallback UI
4. **Component Library**: Radix UI primitives wrapped with custom styling in app/components/ui/

### Data Flow

1. User submits form with product details and brand images
2. Form data validated with Zod schema
3. API endpoint generates story using selected AI provider
4. Story streamed back to client with extracted copy candidates
5. Generation logged to database for analytics

## Environment Variables

Required environment variables:

- `DATABASE_URL` - LibSQL/Turso database URL
- `TURSO_AUTH_TOKEN` - Authentication token for Turso
- AI provider keys (as needed)

## Database Schema

The app uses Kysely with LibSQL. Types are auto-generated from the database schema:

- Run `pnpm kysely:codegen` to regenerate types after schema changes
- Generated types are in `app/services/types.ts`
- Migrations are in `migrations/` directory
