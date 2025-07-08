# Energy Market Visualization Codebase Constitution

> *"Be a yardstick of quality. Some people aren't used to an environment where excellence is expected."* — Steve Jobs

This document serves as the **DNA, Bible, and Constitution** for the Energy Market Visualization codebase. Every line of code, every architectural decision, and every deployment must honor these principles.

---

## 📚 Source Documentation

This constitution is derived from and governed by:

- **[`docs/design.md`](design.md)** — Technical architecture, performance targets, and quality gates
- **[`docs/issues.md`](issues.md)** — Aggressively scoped issue backlog with binary acceptance criteria
- **User Rules** — Extreme organization, straightforward implementations, necessity-driven changes

---

## 🎯 Core Principles

### 1. **Excellence is Non-Negotiable**

- **Sub-second everything**: p95 latency ≤ 200ms or the build fails
- **Pixel-perfect UX**: Visual regression testing against Figma prototypes
- **Zero-downtime releases**: Blue-green deployments with automated smoke tests
- **Observability first**: Every request traced, metered, and logged before business logic

### 2. **Simplicity Through Sophistication**

- **Choose boring technology** — Proven stacks over bleeding edge
- **Minimize cognitive load** — One concept, one place, one way
- **Delete more than you add** — Every line of code is a liability
- **Compose, don't complicate** — Small, focused modules that do one thing perfectly

### 3. **Organization as Architecture**

- **Monorepo structure** — Everything visible, nothing hidden
- **Domain-driven modules** — `domain/`, `repository/`, `web/` boundaries
- **Conventional everything** — Commits, naming, file structure
- **Self-documenting code** — Read like prose, annotate with intention

### 4. **Future-Forward Technology**

- **Reactive by default** — WebFlux, R2DBC, non-blocking everything
- **Cloud-native DNA** — Kubernetes, containers, immutable infrastructure
- **Modern frameworks** — Spring Boot 3, React 19, Chart.js 5
- **Security embedded** — OIDC, TLS 1.3, Vault secrets, zero trust

### 5. **Quality is a Feature**

- **Tests define behavior** — 100% coverage, mutation testing
- **Static analysis enforced** — SonarQube, ESLint, Spotless
- **Performance budgets** — Gatling gates, memory limits, CPU constraints
- **Accessibility mandatory** — axe-core clean, WCAG AA compliance

---

## 🤖 AI Agent Guidelines

### **WHAT YOU CAN DO**

✅ **Implement features from [`docs/issues.md`](issues.md)**

- Each issue has binary acceptance criteria
- Labels indicate priority and story points
- Follow the exact scope — no feature creep

✅ **Enforce the technology stack**

- **Backend**: Spring Boot 3 + WebFlux + R2DBC + MySQL 8.4
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Infrastructure**: Kubernetes + Helm + Argo CD + Prometheus

✅ **Maintain code quality**

- Run tests before any code change
- Enforce formatting with Spotless/Prettier
- Update documentation when changing behavior
- Keep test coverage ≥ 80%

✅ **Optimize for performance**

- Database queries must use indexes
- WebSocket frames ≤ 30s intervals
- Chart.js decimation for large datasets
- Redis caching for hot data

✅ **Ensure security**

- Validate all inputs
- Use parameterized queries
- Never log sensitive data
- Follow principle of least privilege

### **WHAT YOU CANNOT DO**

❌ **Break the build**

- CI pipeline must stay green
- No commits that fail tests
- No degraded performance metrics

❌ **Deviate from architecture**

- No synchronous calls in reactive stack
- No direct database access from frontend
- No business logic in controllers

❌ **Compromise on quality**

- No TODO comments in production code
- No hardcoded values
- No untested code paths

❌ **Add unnecessary complexity**

- No new dependencies without justification
- No premature optimization
- No architectural astronauts

---

## 🏗️ Technical Standards

### **Code Organization**

```markdown
energy-market-visualization/
├── backend/
│   ├── energy-service/          # Main REST + WebSocket API
│   └── energy-prices/           # Data ingestion pipeline
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API clients
│   │   └── types/               # TypeScript definitions
├── infra/
│   ├── helm/                    # Kubernetes deployment charts
│   ├── mysql/                   # Database schemas and migrations
│   └── pulumi/                  # Infrastructure as code
└── docs/                        # Architecture and runbooks
```

### **Naming Conventions**

- **Classes**: `PascalCase` (e.g., `PriceRepository`)
- **Methods**: `camelCase` (e.g., `findPricesByMarket`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_PRICE_HISTORY`)
- **Files**: `kebab-case.extension` (e.g., `price-chart.component.tsx`)
- **Branches**: `feature/issue-123-descriptive-name`

### **Error Handling**

- **Backend**: Reactive error operators (`onErrorResume`, `doOnError`)
- **Frontend**: Error boundaries and React Query error states
- **Monitoring**: Structured logging with correlation IDs
- **User Experience**: Graceful degradation, never white screens

### **Performance Budgets**

| Metric | Target | Enforcement |
|--------|--------|-------------|
| API Response Time | p95 ≤ 200ms | Gatling CI gate |
| Frontend Bundle Size | ≤ 500KB gzipped | Webpack bundle analyzer |
| Database Query Time | ≤ 50ms | R2DBC metrics |
| Memory Usage | ≤ 512MB per pod | Kubernetes limits |

---

## 🚀 Deployment Standards

### **CI/CD Pipeline**

1. **Code Quality Gates**
   - Unit tests (100% passing)
   - Integration tests (Testcontainers)
   - Static analysis (SonarQube ≥ 80% coverage)
   - Security scan (OWASP dependency check)

2. **Build Artifacts**
   - Docker images with SBOM
   - Helm charts versioned to git SHA
   - Frontend bundles to CDN

3. **Deployment Strategy**
   - Blue-green on Kubernetes
   - Automated rollback on health check failure
   - Canary releases for major changes

### **Observability**

- **Metrics**: Prometheus + Grafana dashboards
- **Logs**: Structured JSON to Loki
- **Traces**: OpenTelemetry to Tempo
- **Alerts**: SLO-based alerting to PagerDuty

---

## 🎖️ Definition of Done

Every feature, bug fix, or improvement must satisfy ALL criteria:

- [ ] **Functionality**: All acceptance criteria met
- [ ] **Testing**: Unit, integration, and e2e tests passing
- [ ] **Performance**: Latency budgets maintained
- [ ] **Security**: No vulnerabilities introduced
- [ ] **Documentation**: READMEs and runbooks updated
- [ ] **Observability**: Metrics, logs, and traces instrumented
- [ ] **Accessibility**: WCAG AA compliance verified
- [ ] **Review**: Code reviewed by at least one team member

---

## 🌟 Cultural Values

### **Craftsmanship**

- Write code as if the person maintaining it is a violent psychopath who knows where you live
- Every function should be beautiful enough to frame
- Refactor ruthlessly — technical debt compounds

### **User Obsession**

- Sub-second response times are table stakes
- Accessibility is not optional
- Error messages should help, not frustrate

### **Continuous Improvement**

- Measure everything, optimize relentlessly
- Post-mortems are learning opportunities
- Automate everything that can be automated

### **Team Excellence**

- Code reviews are collaborative, not combative
- Pair programming on complex problems
- Knowledge sharing through documentation

---

## ⚖️ Governance

### **This Constitution**

- **Immutable**: Core principles never change
- **Evolvable**: Technical standards adapt with technology
- **Enforceable**: CI/CD pipeline enforces all rules
- **Transparent**: All decisions documented and traceable

### **Change Process**

1. Propose changes via RFC (Request for Comments)
2. Team consensus required for principle changes
3. Technical standards can evolve with proper testing
4. All changes must improve simplicity, not complicate

---

## 🎯 Success Metrics

**We succeed when:**

- Users love the experience (NPS ≥ 9)
- Developers love the codebase (0 critical bugs in production)
- Operations run themselves (MTTR ≤ 5 minutes)
- Business objectives are exceeded (SLA ≥ 99.9%)

---

> *"Simplicity is the ultimate sophistication."* — Leonardo da Vinci

**Remember: Every line of code is a promise to your future self and your teammates. Make it count.**
