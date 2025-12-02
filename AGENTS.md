# AGENTS.md - Amp Configuration for Punchout UI Frontend

## Project Overview
This is a Next.js 14 frontend application for a cXML Punchout Service, using TypeScript, Tailwind CSS, and Bootstrap.

## Commands

### Development
```bash
npm run dev          # Start development server on port 3000
```

### Build
```bash
npm run build        # Production build
npm run build:dev    # Build with dev environment
npm run build:stage  # Build with stage environment
npm run build:prod   # Build with production environment
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript type checking
```

### Start Production Server
```bash
npm run start        # Start production server on port 3000
```

## Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components
- `src/services/` - API service layer
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions

## Code Style Guidelines
1. Use TypeScript for all new files
2. Use functional components with hooks
3. Follow Next.js App Router conventions
4. Use Tailwind CSS for styling (Bootstrap is also available)
5. Keep components small and focused
6. Use proper TypeScript types, avoid `any`

## Testing
Currently no test framework is configured. When adding tests:
- Use Jest + React Testing Library
- Place test files next to the source files with `.test.tsx` extension

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL

## CI/CD with Amp SDK
This project uses GitHub Actions with Amp SDK integration for:
- **Automated Code Review**: AI-powered PR reviews
- **Issue Triage**: Automatic issue labeling and analysis
- **Test Generation**: On-demand AI test generation
- **Deployment Checks**: Pre-deployment analysis

### Required Secrets for GitHub Actions
- `AMP_API_KEY` - Your Amp API key from ampcode.com/settings

## Common Pitfalls
1. Don't forget to set environment variables for different environments
2. Always run `npm run lint` before committing
3. Ensure TypeScript compiles without errors
4. Use absolute imports with `@/` prefix when available
