# Energy Market Visualization

Synthetic wholesale power telemetry. Reactive API. Analytics dashboard. No live ISO feeds required.

```mermaid
flowchart LR
  G[Generator] --> API[Spring API]
  API --> UI[React dashboard]
```

## Get started

```bash
cd backend && mvn spring-boot:run
cd frontend && npm install && npm run dev   # http://localhost:3000
```

## Overview

Five deterministic markets: **CAISO**, **ERCOT**, **MISO**, **NEISO**, **PJM**.

Each exposes price, load, carbon intensity, renewable share, volatility, and short-horizon forecast envelopes — reproducible on every run.

| Endpoint | Returns |
| :-- | :-- |
| `GET /api/markets/catalog` | Market metadata |
| `GET /api/markets/overview` | Cross-market snapshot |
| `GET /api/markets/{code}/snapshot` | History, forecast, insights |

Snapshot query params control history window, resolution, and forecast horizon.

Split hosting: set `VITE_API_BASE_URL` in `frontend/.env.local` (see `.env.example`).

## Reference

**Verify.**

```bash
cd backend && mvn test
cd frontend && npm run type-check && npm run test:ci && npm run build
```

Requires Java 22+, Maven 3.9+, Node 20+.

MIT · [LICENSE](LICENSE)
