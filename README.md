# Habitum — Premium Habit Tracker

Habitum is a production-quality, offline-first habit tracker for iOS + Android built with Expo Router. It blends deep habit analytics, a reflective journal, and a growing companion experience — all without a backend.

## Highlights

- Habits CRUD with schedules, targets, icons, and color palettes
- Offline-first persistence via SQLite + typed repositories
- Check-ins with streak engine + GitHub-style heatmap
- Journal with mood/energy sliders + habit-linked reflections
- XP, levels, and achievement unlocks with animated toasts
- Virtual companion that evolves with XP + streaks
- Streak challenges with invite codes, QR, leaderboards, and share cards
- Local notifications + haptics + polished micro-interactions
- Light/dark themes, accessible typography, dynamic type friendly

## Screenshots

Add screenshots in `assets/screenshots/` and update these paths:

- `assets/screenshots/today.png`
- `assets/screenshots/habits.png`
- `assets/screenshots/journal.png`
- `assets/screenshots/insights.png`
- `assets/screenshots/companion.png`
- `assets/screenshots/challenge.png`

## Tech Stack

- Expo SDK 54, React Native, TypeScript
- expo-router (file-based navigation)
- expo-sqlite (local persistence)
- react-native-reanimated + gesture handler
- @shopify/flash-list (fast lists)
- zod (runtime validation)
- Jest (unit tests)

## Architecture

```
┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│    UI / App  │  ->  │ Repositories│  ->  │   SQLite DB  │
│ (expo-router)│      │  + Zod      │      │  + Migrations│
└──────────────┘      └─────────────┘      └──────────────┘
        │                      │
        └──── Services (XP, achievements, notifications, streaks)
```

## Folder Structure

```
app/                 # Expo Router routes
src/
  components/        # UI components (cards, rings, toasts, pet view)
  config/            # Feature flags / dev toggles
  data/              # Icon/color presets
  db/                # SQLite client + migrations
  domain/            # Zod schemas + domain models
  repositories/      # Typed data access layer
  screens/           # Shared screen-level components
  services/          # Notifications, streaks, XP, achievements
  theme/             # Design tokens + theme provider
  utils/             # Date helpers, formatting
assets/              # Icons + splash assets
```

## Data Model (SQLite)

| Table | Purpose |
| --- | --- |
| `habits` | Habit definitions, schedule, targets, reminder time |
| `checkins` | Daily habit completions (date_key, count) |
| `journal_entries` | Mood/energy + notes + habit links |
| `achievements` | Unlock state + metadata |
| `challenges` | Challenge definitions + invite codes |
| `challenge_members` | Local leaderboard entries |
| `app_state` | App-level key/value state (XP, notification ids) |
| `schema_migrations` | Migration version tracking |

## Scripts

- `npm run start` — run Expo dev server
- `npm run ios` / `npm run android` — open on device/simulator
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run test` — Jest

## Environment Notes

- Runs fully offline; no backend required.
- Notifications require permissions on device.
- QR + share cards are generated locally.

## Troubleshooting

- If notifications don’t fire, re-open the app to re-request permissions.
- If you see Metro cache issues: `npx expo start -c`.
- If Jest fails in CI, make sure `expo` + `jest-expo` versions align.

## Roadmap

- Cloud sync (optional)
- Habit templates + marketplace
- Deeper correlation insights (mood vs streak)
- Companion customization

---

MIT licensed. See `LICENSE`.
