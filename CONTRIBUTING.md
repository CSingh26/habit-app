# Contributing

Thanks for helping improve Habitum.

## Getting Started

1. Install dependencies: `npm install`
2. Start Expo: `npm run start`
3. Run tests: `npm run test`

## Guidelines

- Keep UI components small and reusable.
- Use repositories for data access (no direct SQL in screens).
- Validate DB data with Zod schemas.
- Prefer `FlashList` for long lists.
- Run `npm run lint` before opening a PR.
