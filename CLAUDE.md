# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Synthetic wholesale power market telemetry for five ISO-style regions (CAISO, ERCOT, MISO, NEISO, PJM). Spring Boot reactive API in `backend/`, React dashboard in `frontend/`. No live grid feeds — deterministic generator, reproducible snapshots.

## Commands

**Backend (Java 22+, Maven 3.9+):**

```bash
cd backend
mvn test                    # unit tests + Spotless check (bound to verify lifecycle)
mvn spotless:apply          # format before pushing Java changes
mvn spring-boot:run         # API on :8080
```

**Frontend (Node 20+):**

```bash
cd frontend
npm ci
npm run dev                 # http://localhost:5173
npm run type-check && npm run test:ci && npm run build
```

**CI mirror:** `.github/workflows/ci.yml` runs backend `mvn test` and frontend verify on every push/PR.

## Architecture

- `backend/src/main/java/com/energymarket/market/generator/` — synthetic price/load/carbon series
- `backend/.../api/MarketController.java` — REST surface (`/api/markets/catalog`, `overview`, `{code}/snapshot`)
- `frontend/src/` — dashboard consuming `VITE_API_BASE_URL`

## Rules

- Keep Spotless clean; `-Werror` is on for compiler warnings.
- Do not bump dependency or Java/Node versions without explicit approval.
- Split hosting: frontend `.env.local` points at deployed API via `VITE_API_BASE_URL`.
- Commit messages: state the user-visible or CI-visible outcome in the first line.
