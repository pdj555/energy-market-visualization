# Energy Market Visualization Tool Design

Below is an **issue‑backlog you can paste straight into GitHub** (each bullet is a *separate* issue).
Every issue is:

* **Aggressively scoped** – one atomic deliverable per ticket.
* **Pre‑labeled** – so your board can auto‑triage.
* **“Done”‑driven** – acceptance criteria are binary; no wiggle room.

Copy‑and‑paste each block into **`energy‑viz/.github/ISSUE_TEMPLATE/*.md`** or bulk‑create with the GitHub CLI:

```bash
gh issue create -F 01-repo-bootstrap.md
```

---

## 🔨 Foundation & Dev Ops

1. **`Repo bootstrap: monorepo + default branch protections`**
   *Labels*: `devops`, `priority:P0`, `sp:2`

   * Create private repo **energy‑viz** using template *java‑react‑monorepo*.
   * Enable branch protection on `main` (require PR, 2 reviewers, status checks).
   * Add CODEOWNERS (backend, frontend, infra leads).
     **Acceptance**: new repo reachable; pushing to `main` without PR is blocked.

2. **`CI pipeline: build, test, docker publish`**
   *Labels*: `devops`, `priority:P0`, `sp:3`

   * Add `/.github/workflows/build.yml` (JDK 22, Node 20, pnpm).
   * Cache Maven & pnpm.
   * Matrix: `test‑backend`, `test‑frontend`, `docker‑publish`.
     **Acceptance**: PR triggers all jobs; artefacts `energy‑service:SHA`, `energy‑viz:SHA` in registry.

3. **`Static code quality gates (SonarQube + Spotless + ESLint)`**
   *Labels*: `devops`, `quality`, `sp:3`

   * Add SonarCloud project; fail build < 80 % coverage.
   * Hook Spotless + ktlint for Java; Prettier + ESLint for TS.
     **Acceptance**: intentional style error causes CI failure.

4. **`Pre‑commit hooks via Husky & Lefthook`**
   *Labels*: `devops`, `sp:1`

   * Block commits with lint/test failures locally.
     **Acceptance**: bad commit blocked pre‑push.

---

## 🗄️ Database & Persistence

1. **`DDL: energy_price table w/ partitioning script`**
   *Labels*: `backend`, `database`, `sp:2`

   * SQL in `infra/mysql/schema.sql` per spec (composite index + monthly partitions).
     **Acceptance**: Testcontainers spins up schema; `EXPLAIN` on sample range scan uses `k_market_ts`.

2. **`Retention Lambda: drop partitions older than 6 months`**
   *Labels*: `infra`, `sp:2`

   * Pulumi script schedules EventBridge → Lambda → `ALTER TABLE … DROP PARTITION`.
     **Acceptance**: Local SAM test shows correct SQL run for mock date.

---

## 🔄 Data Ingestion

1. **`Create energy‑prices Spring Cloud Task module`**
   *Labels*: `backend`, `sp:3`

   * Skeleton with WebFlux client, MapStruct DTOs, SchedLock guard.
     **Acceptance**: App starts; scheduled job logs successful poll.

2. **`Implement ISO‑NE polling connector`**
   *Labels*: `backend`, `integration`, `sp:3`

   * Call ISO‑NE API every 15 s; map to domain; store in Redis ZSET.
     **Acceptance**: Unit test with WireMock fixture passes.

3. **`Write‑behind Redis → MySQL bulk writer`**
   *Labels*: `backend`, `performance`, `sp:3`

   * Flush 250 rows/5 s via R2DBC bulk insert.
     **Acceptance**: Gatling shows ≤ 10 ms insert latency @1 k/ s.

---

## ☕ Backend Service

1. **`Scaffold energy‑service (Spring Boot 3, WebFlux, R2DBC)`**
    *Labels*: `backend`, `sp:2`

    * Modules: `domain`, `repository`, `web`.
      **Acceptance**: Healthcheck `/actuator/health` returns UP.

2. **`Reactive PriceRepository w/ custom range + aggregation queries`**
    *Labels*: `backend`, `sp:3`

    * Implement minute‑bucket AVG SQL.
      **Acceptance**: Integration test verifies correct AVG result on sample dataset.

3. **`REST endpoint /api/v1/prices?market&from&to`**
    *Labels*: `backend`, `api`, `sp:2`
    **Acceptance**: OpenAPI doc generated; 200 on happy path, 400 on bad params.

4. **`WebSocket topic /topic/price/{market}`**
    *Labels*: `backend`, `realtime`, `sp:3`

    * STOMP broker, 10 s heartbeat, drop after 3 missed.
      **Acceptance**: Cypress test receives 2+ frames in 60 s.

5. **`Latency SLO instrumentation (Micrometer + Prometheus)`**
    *Labels*: `backend`, `observability`, `sp:2`

    * Expose `histogramTimer` for DB read, transform, socket publish.
      **Acceptance**: `/actuator/metrics` shows timers.

---

## 🖥️ Frontend

1. **`Bootstrap React 19 + Vite + TS`**
    *Labels*: `frontend`, `sp:2`

    * Tailwind configured; Storybook added.
      **Acceptance**: `pnpm dev` serves blank page w/ Tailwind style.

2. **`Implement Header: market dropdown, refresh toggle, latency pill`**
    *Labels*: `frontend`, `ux`, `sp:2`
    **Acceptance**: Visual regression test passes against Figma.

3. **`usePriceStream hook (SockJS + STOMP)`**
    *Labels*: `frontend`, `realtime`, `sp:2`
    **Acceptance**: Jest test mocks socket, updates atom on message.

4. **`Chart.js live line chart w/ LTTB decimation`**
    *Labels*: `frontend`, `viz`, `sp:3`
    **Acceptance**: 12 h of 30 s data renders < 16 ms frame.

5. **`Trend panel: min/max/avg + export CSV`**
    *Labels*: `frontend`, `sp:2`
    **Acceptance**: Clicking "Export" downloads valid CSV.

---

## 🔐 Security

1. **`Integrate Keycloak OIDC (SPA flow + Spring resource‑server)`**
    *Labels*: `security`, `sp:3`
    **Acceptance**: Unauthenticated REST call returns 401; login succeeds, token accepted.

2. **`Role‑based method security (@PreAuthorize)`**
    *Labels*: `security`, `backend`, `sp:1`
    **Acceptance**: User without `analyst` role denied.

3. **`Vault sidecar for DB creds + TLS certs via cert‑manager`**
    *Labels*: `security`, `infra`, `sp:3`
    **Acceptance**: Secrets never appear in pod env vars.

---

## 🧪 Testing & Quality

1. **`JUnit + Testcontainers baseline (MySQL, Redis)`**
    *Labels*: `testing`, `backend`, `sp:2`
    **Acceptance**: `mvn test` spins containers, passes sample test.

2. **`Vitest + React‑Testing‑Library baseline`**
    *Labels*: `testing`, `frontend`, `sp:1`
    **Acceptance**: `pnpm test` runs sample render test.

3. **`Cypress e2e: full stack happy path`**
    *Labels*: `testing`, `e2e`, `sp:3`
    **Acceptance**: Docker‑compose up → Cypress spec passes CI.

4. **`Gatling perf test: 5 k sockets + 500 RPS`**
    *Labels*: `testing`, `performance`, `sp:3`
    **Acceptance**: CI fails if p95 ≥ 200 ms.

5. **`axe‑core accessibility scan`**
    *Labels*: `testing`, `a11y`, `sp:1`
    **Acceptance**: No critical violations.

---

## ☁️ Infrastructure & CD

1. **`Helm chart: energy‑service with blue‑green toggle`**
    *Labels*: `infra`, `k8s`, `sp:2`
    **Acceptance**: `helm template` renders Service, Deployment with `strategy: BlueGreen`.

2. **`Helm chart: energy‑viz SPA served via Nginx sidecar`**
    *Labels*: `infra`, `k8s`, `sp:2`
    **Acceptance**: Chart installs; `/` serves index.html.

3. **`Argo CD application sync on new image tag`**
    *Labels*: `infra`, `cd`, `sp:2`
    **Acceptance**: Pushing tag triggers rollout; Argo shows healthy.

4. **`Prometheus, Grafana, Loki, Tempo stack`**
    *Labels*: `observability`, `infra`, `sp:3`
    **Acceptance**: Dashboard displays request latency, error %, trace waterfall.

---

## 🎛️ SRE & Ops

1. **`Alert rules: latency, socket drops, DB errors`**
    *Labels*: `sre`, `observability`, `sp:2`
    **Acceptance**: Firing alert logs in Alertmanager; test pageant.

2. **`Runbook markdown in /runbooks/*.md`**
    *Labels*: `sre`, `docs`, `sp:1`
    **Acceptance**: Each alert links to runbook section.

3. **`Chaos drill: kill MySQL primary, verify auto‑failover`**
    *Labels*: `sre`, `chaos`, `sp:2`
    **Acceptance**: Gatling run continues ≤ 5 s error spike, recovers.

4. **`Kubecost budget alert for monthly spend`**
    *Labels*: `sre`, `cost`, `sp:1`
    **Acceptance**: Crossing threshold sends Slack message.

---

## 📦 Release

1. **`Beta cut tag v0.9.0 + release notes`**
    *Labels*: `release`, `sp:1`
    **Acceptance**: CHANGELOG.md populated; GitHub release drafted.

2. **`Production launch v1.0.0`**
    *Labels*: `release`, `sp:1`, `priority:P0`
    **Acceptance**: All Definition‑of‑Done boxes ticked; green‑lights 24 h post‑deploy.

---

### One last thing…

> Treat each issue as a *contract*.
> If any acceptance criterion feels soft, tighten it until failure is obvious.
> “Good enough” is **not** good enough.
