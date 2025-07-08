# Energy Market Visualization Tool Design

## 0 Ground Rules for Excellence

| Principle                  | Concrete Enforcement Mechanism                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| **Pixel‑perfect UX**       | Figma prototype signed‑off by PO → automated visual regression (Chromatic) on every PR              |
| **Sub‑second API latency** | 200 ms p95 target in SLO; Gatling performance test fails build if p95 ≥ 200 ms                      |
| **Zero‑downtime releases** | Blue‑green deployments on Kubernetes with automated smoke tests                                     |
| **Observability first**    | Trace, metric, log emitted on every request (OpenTelemetry) before the first line of business logic |

---

## 1 Project Kick‑off (Day 0‑2)

1. **Repo creation**

   ```bash
   gh repo create energy‑viz --private --template java‑react‑monorepo
   ```

2. **Branch strategy** – trunk‑based with short‑lived feature branches; require ✅ checks on PR:

   * Unit tests
   * SonarQube quality gate (≥ 80% coverage, zero critical smells)
   * Conventional commits
3. **CI skeleton** (GitHub Actions)

   * `build.yml` → JDK 22, Node 20, pnpm, Docker buildx.
   * Cache Maven & pnpm.
   * Jobs: `test‑backend`, `test‑frontend`, `docker‑publish`.

---

## 2 Architecture Overview

```markdown
┌──────────────┐    WebSocket   ┌───────────────┐
│ React (R19)  │◀──────────────▶│ Spring Boot 3 │
│  + Chart.js  │   STOMP/SockJS │  (WebFlux)    │
└──────┬───────┘                └───────┬───────┘
       │REST / GraphQL                   │R2DBC
┌──────▼───────┐                ┌───────▼────────┐
│  Edge Nginx  │                │  MySQL 8.4     │
└──────────────┘                └───────────────┘
```

* **Reactive stack** (WebFlux + R2DBC) keeps threads near‑zero even at high connection counts.
* **WebSocket (STOMP over SockJS)** chosen over SSE for bidirectional control (client pings, server deltas).
* **MySQL** partitioned & indexed for 6‑month rolling window; beyond 6 months archived to S3‑parquet via Airbyte.

---

## 3 External Data Ingestion (Day 2‑6)

1. **Choose data feeds**

   * ISO‑NE “Real‑Time Hub LMP”, ERCOT RTM, EIA API as fallback.
2. **Create `energy‑prices` module** (Spring Cloud Task)

   * Uses **SchedLock** to ensure single node polls.
   * Poll interval: 15 s (twice the UI refresh) to hide upstream jitter.
3. **DTO → Domain conversion** with MapStruct; validate:

   * timestamp monotonic
   * price ≥ 0
4. **Write‑behind cache**

   * Redis sorted‑set keyed by `(market)` stores last 500 points.
   * Async batch write to MySQL via R2DBC bulk insert (250 rows max) every 5 s.
5. **Unit + contract tests** against WireMock‑recorded fixtures.

---

## 4 Database Design (Day 4‑6)

```sql
CREATE TABLE energy_price (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    market      VARCHAR(10) NOT NULL,
    ts_utc      DATETIME(3) NOT NULL,
    price_mwh   DECIMAL(9,4) NOT NULL,
    inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY k_market_ts (market, ts_utc),
    KEY k_ts     (ts_utc)
) PARTITION BY RANGE COLUMNS(ts_utc) (
    PARTITION p0 VALUES LESS THAN ('2025-03-01'),
    PARTITION p1 VALUES LESS THAN ('2025-04-01'),
    ...
);
```

* **Composite index** `(market, ts_utc)` satisfies both exact‑feed lookups and time‑range scans.
* **Monthly partitions** allow hot partition in buffer pool, cold partitions pruned.
* **6‑month retention**: EventBridge cron triggers Lambda that runs `ALTER TABLE ... DROP PARTITION`.

---

## 5 Backend Service (Day 5‑10)

### 5.1 Scaffolding

```bash
spring init --build=maven -d=webflux,data-r2dbc,mysql,stomp,lombok,validation energy-service
```

### 5.2 Core components

| Component               | Responsibility                            |
| ----------------------- | ----------------------------------------- |
| `PriceRepository`       | Reactive find & aggregate queries         |
| `PriceService`          | Business rules, TTL trimming, DTO mapping |
| `PriceController`       | REST + GraphQL endpoints                  |
| `PriceSocketController` | `/topic/price/{market}` broadcast         |
| `AggregationService`    | Custom windowed averages (SQL below)      |

```sql
SELECT market,
       DATE_FORMAT(ts_utc, '%Y-%m-%d %H:%i:00') AS minute_bucket,
       AVG(price_mwh) AS avg_price
FROM energy_price
WHERE ts_utc BETWEEN :from AND :to
GROUP BY market, minute_bucket;
```

### 5.3 WebSocket push

* Configure broker relay: `/topic/**` (server → client), `/app/**` (client → server)
* Heartbeat 10 s / 10 s; drop connection after 3 missed beats.
* Use `Flux.interval(Duration.ofSeconds(30))` → query Redis cache → `Sinks.Many` emit.

### 5.4 Latency budget

| Stage               | Target (ms)             |
| ------------------- | ----------------------- |
| DB read             | ≤ 50                    |
| Transform           | ≤ 10                    |
| WebSocket frame out | ≤ 5                     |
| Total               | **≤ 65 ms** server time |

Enforce with Spring Boot Micrometer + SLO actuator.

---

## 6 Frontend (Day 7‑12)

### 6.1 Bootstrapping

```bash
pnpm create vite energy-viz --template react-ts
pnpm add @tanstack/react-query chart.js react-chartjs-2 stompjs sockjs-client tailwindcss
```

### 6.2 Layout & UX

* Single‑page split:

  * **Header** – market dropdown, auto‑refresh toggle, latency indicator (green ≤ 100 ms).
  * **Main chart panel** – live line chart (Chart.js 5, `decimation: 'lttb'`).
  * **Trend panel** – 24 h min/max/avg, sparkline, export CSV.

### 6.3 State management

* **React Query** for REST historical fetch; stale‑time 55 s (just shy of push cadence).
* WebSocket hook `usePriceStream(market)` returns live ticks.
* Combine historical + live into `Recoil atom` for deterministic renders.

### 6.4 Chart.js specifics

```ts
const chartCfg: ChartConfiguration<'line'> = {
  parsing: false,
  animation: false,
  scales: { x: { type: 'timeseries' }, y: { beginAtZero: true } },
  plugins: { decimation: { enabled: true, algorithm: 'lttb', samples: 300 } }
};
```

* **Decimation** prevents overdraw beyond 2 kpts.
* **Data hygiene**: Cap buffer at last 12 h (1440 samples @30 s); shift older points off.

---

## 7 End‑to‑End Security (parallel)

| Layer     | Implementation                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Transport | TLS 1.3 everywhere, certs via cert‑manager + Let’s Encrypt                                              |
| AuthN     | Keycloak OIDC; SPA gets access+refresh tokens; WebSocket upgraded with `Authorization: Bearer …` header |
| AuthZ     | Spring Security method security (`@PreAuthorize("hasRole('analyst')")`)                                 |
| Secrets   | Externalized to Vault; ServiceAccount JWT → Vault Agent Sidecar → Spring PropertySource                 |

---

## 8 Quality Engineering (parallel)

1. **Backend** – JUnit 5, Testcontainers MySQL; mutation testing with Pitest (≥ 70% survived = fail).
2. **Frontend** – Vitest + React‑Testing‑Library, Cypress e2e (Docker‑compose orchestrates full stack).
3. **Performance** – Gatling simulating 5 k WebSocket subs + 500 REST QPS; threshold p95 200 ms.
4. **Accessibility** – axe‑core in Cypress; all violations fixed.
5. **Static analysis** – Spotless, ESLint, Prettier, OWASP Dependency‑Check.

---

## 9 Infrastructure & Deployment (Day 10‑14)

| Component     | Stack                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| Runtime       | Kubernetes 1.30 (EKS / GKE)                                             |
| Image build   | Docker buildx + SBOM (Syft)                                             |
| Helm charts   | One for `energy‑service`, one for `energy‑viz`                          |
| Ingress       | Nginx ingress‑nginx w/ ModSecurity tuned rules                          |
| MySQL         | Amazon Aurora MySQL or GCP CloudSQL HA (multi‑AZ)                       |
| Redis         | Redis Cluster 3‑shard, 1 GB per shard                                   |
| CDN           | CloudFront / Cloud CDN for SPA assets                                   |
| Observability | Prometheus Operator, Grafana 10 dashboards, Loki for logs, Tempo traces |

### Deployment workflow

1. PR merged → GitHub Action builds images, pushes to registry.
2. Argo CD detects new tag, applies Helm‑chart version bump.
3. Blue‑green:

   * New ReplicaSet spins up, readiness gated on `/actuator/health` + Cypress smoke test POD.
   * 100% traffic flipped; old RS drained after 5 min watch.

---

## 10 Operational Excellence

* **SRE Runbook** – define alert → diagnosis → remediation. Example:

  * *Alert*: `price_socket_latency_p95 > 150ms for 5m`
  * *Diagnosis*: Check Redis CPU; scale write‑behind worker.
* **Chaos drills** – kill MySQL primary, verify R2DBC retry logic.
* **Cost guardrails** – Kubecost budget alerts; autoscaler min = 2 max = 10 pods.

---

## 11 Timeline Summary (GanTT‑style)

| Day   | Milestone                                  |
| ----- | ------------------------------------------ |
| 0‑2   | Repo + CI baseline                         |
| 2‑6   | Ingestion pipeline + DB schema             |
| 5‑10  | Backend APIs & WebSocket                   |
| 7‑12  | Frontend MVP                               |
| 10‑14 | Infra + blue‑green deployment              |
| 15    | Beta cut – Feature‑freeze, full regression |
| 17    | Load & chaos testing sign‑off              |
| 18    | Production launch 🚀                       |

---

## 12 “Definition of Done” Checklist

* [ ] p95 latency ≤ 200 ms for 5 k concurrent users
* [ ] 100 % unit & integration tests passing
* [ ] OWASP Top‑10 scan clean
* [ ] Synthetic monitoring dashboard green 24 h pre‑launch
* [ ] Stakeholders sign‑off on Figma‑to‑prod pixel diff ≤ 2 px

---

### Final admonition

> **“Be a yardstick of quality.”**
> If any step above feels “good enough,” redo it until it’s *insanely great*.
