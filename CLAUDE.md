# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Synthetic wholesale power market telemetry for five ISO-style regions (CAISO, ERCOT, MISO, NEISO, PJM). Spring Boot reactive API in `backend/`, Next.js dashboard in `frontend/`. No live grid feeds — deterministic generator, reproducible snapshots.

## Commands

**Backend (Java 22+, Maven 3.9+):**

```bash
cd backend
mvn test                    # unit tests + Spotless check (bound to verify lifecycle)
mvn spotless:apply          # format before pushing Java changes
mvn spring-boot:run         # API on :8080
```

**Frontend (Node 26+, pnpm 11+, Next.js 16):**

```bash
cd frontend
corepack enable
pnpm install
pnpm dev                    # http://localhost:3000
pnpm run type-check && pnpm run test:ci && pnpm run build
```

**CI mirror:** `.github/workflows/ci.yml` runs backend `mvn test` and frontend verify on every push/PR.

## Architecture

- `backend/src/main/java/com/energymarket/market/generator/` — synthetic price/load/carbon series
- `backend/.../api/MarketController.java` — REST surface (`/api/markets/catalog`, `overview`, `{code}/snapshot`)
- `frontend/app/` — Next.js App Router entry
- `frontend/components/` — dashboard UI (`dashboard/`, `platform/`, `ui/`)
- `frontend/lib/` — API client, hooks, formatters

## Rules

- Keep Spotless clean; `-Werror` is on for compiler warnings.
- Do not bump dependency or Java/Node versions without explicit approval.
- Split hosting: frontend `.env.local` points at deployed API via `NEXT_PUBLIC_API_BASE_URL`.
- Commit messages: state the user-visible or CI-visible outcome in the first line.
