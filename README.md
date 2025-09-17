# Energy Market Visualization

An applied-intelligence sandbox that generates premium electricity market telemetry for product and
analytics experiments. The project ships a synthetic Spring Boot WebFlux API and a modern React
analytics console designed for latency-sensitive price discovery and risk monitoring.

## Capabilities

- **High-signal synthetic data** – deterministic scenario engine produces price, load, carbon
  intensity and renewable penetration curves for five major North American ISOs.
- **Insightful analytics** – volatility, carbon trend and anomaly detection metrics summarise the
  current operating window.
- **Forward-looking forecasts** – price envelope projections with confidence bands to gauge short
  term risk.
- **Interactive dashboard** – React 19 + React Query interface with Tailwind styling, real-time
  refresh indicators and multi-market comparison cards.

## Backend (Spring Boot 3 / Java 22)

The backend lives in [`backend/`](backend/) and exposes reactive JSON endpoints under
`/api/markets`:

| Endpoint | Description |
| --- | --- |
| `GET /api/markets/catalog` | Market catalogue with region, timezone and descriptive context. |
| `GET /api/markets/overview` | Portfolio view of current price, demand and sustainability metrics. |
| `GET /api/markets/{code}/snapshot` | Composite response with historical series, forecast and insights. |

Synthetic data is produced by `MarketDataGenerator`, which combines seasonal shapes, deterministic
noise and anomaly detection to deliver realistic yet reproducible datasets. Tests exercise service
logic and the REST controller using `WebTestClient`.

### Running the backend

```bash
cd backend
mvn spring-boot:run
```

### Backend quality gates

```bash
cd backend
mvn spotless:apply   # optional auto-format
mvn test             # unit tests + coverage rules
```

## Frontend (React 19 + Vite + Tailwind)

The frontend dashboard resides in [`frontend/`](frontend/). It uses TanStack Query to orchestrate
API calls, Chart.js for price visualisation and Tailwind CSS for theming.

### Available scripts

```bash
cd frontend
npm install
npm run dev          # start Vite dev server on http://localhost:3000
npm run build        # production build
npm run test         # Vitest unit tests (watch mode)
npm run test:ci      # Vitest in coverage mode
npm run lint         # ESLint
npm run type-check   # TypeScript compiler checks
```

### Key UI features

- Market picker with history/forecast controls and refresh action.
- Overview grid displaying price movements, demand and sustainability metrics across markets.
- Dual-axis price & demand chart backed by Chart.js (mocked in tests).
- Forecast table summarising confidence bounds for upcoming hours.
- Insights panel showing volatility, demand statistics and operational alerts.

## Contributing

1. Ensure Node.js 20+, npm 10+ and Java 22+ are installed.
2. Run `scripts/pre-commit-quality-check.sh` to execute the combined quality gates.
3. Submit focused changes with accompanying tests.

---

This repository is optimised for demonstrating intelligence-driven energy analytics without
requiring live market data access.
