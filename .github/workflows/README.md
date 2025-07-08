# CI/CD Pipeline Documentation

## Overview

The `build.yml` workflow implements a comprehensive CI/CD pipeline for the Energy Market Visualization project, adhering to Apple-level engineering excellence and the system constitution principles.

## Acceptance Criteria Fulfillment

✅ **PR triggers all jobs**: The workflow triggers on pull requests to `main` and `develop` branches  
✅ **JDK 22**: All matrix jobs use OpenJDK 22 (Temurin distribution)  
✅ **Node 20**: All matrix jobs use Node.js 20 with npm caching  
✅ **pnpm**: Frontend jobs use pnpm with proper caching  
✅ **Maven & pnpm caching**: Optimized caching strategies for both package managers  
✅ **Matrix jobs**: Three distinct matrix jobs: `test-backend`, `test-frontend`, `docker-publish`  
✅ **Artifacts**: Produces `energy-service:SHA` and `energy-viz:SHA` Docker images

## Architecture

### Matrix Strategy

The pipeline uses a GitHub Actions matrix to run three parallel jobs:

1. **test-backend**: Validates Java Spring Boot backend
2. **test-frontend**: Validates React/TypeScript frontend
3. **docker-publish**: Builds and publishes Docker images

### Technology Stack

- **Java**: OpenJDK 22 (Temurin distribution)
- **Node.js**: v20 with npm caching
- **Package Manager**: pnpm for frontend dependencies
- **Build Tool**: Maven for backend, Vite for frontend
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **Security**: Anchore vulnerability scanning

## Pipeline Stages

### 1. Environment Setup

All jobs include:

- Repository checkout with full history
- JDK 22 setup with Maven caching
- Node.js 20 setup with npm caching
- pnpm installation and configuration
- Optimized dependency caching

### 2. Backend Testing (`test-backend`)

- **Project Validation**: Ensures proper Maven project structure
- **Dependency Management**: Cached Maven dependencies
- **Testing**: Runs full test suite with Spring profiles
- **Packaging**: Creates deployable JAR artifacts
- **Performance**: 2GB heap allocation for optimal build performance

### 3. Frontend Testing (`test-frontend`)

- **Project Validation**: Ensures proper package.json structure
- **Dependency Installation**: Frozen lockfile installation via pnpm
- **Code Quality**: ESLint and Prettier checks
- **Testing**: Vitest test suite execution
- **Build Validation**: Production build verification

### 4. Docker Publishing (`docker-publish`)

#### Security-First Approach

- Non-root user containers (uid/gid 1001)
- Minimal attack surface with Alpine Linux
- Health checks for container orchestration
- OCI-compliant image metadata

#### Multi-Architecture Support

- **Platforms**: linux/amd64, linux/arm64
- **Build Cache**: GitHub Actions cache optimization
- **Registry**: GitHub Container Registry with automated authentication

#### Image Artifacts

**energy-service** (Backend):

- Base: `eclipse-temurin:22-jre-alpine`
- Optimized JVM flags for containerized environments
- Health check endpoint: `/actuator/health`
- Memory limit: 75% of container memory

**energy-viz** (Frontend):

- Multi-stage build: Node.js builder + Nginx runtime
- Optimized Nginx configuration with gzip compression
- SPA routing support with fallback to index.html
- API proxy configuration for backend integration

#### Tagging Strategy

Images are tagged with multiple strategies:

- **Branch-based**: `feature-branch-name`
- **PR-based**: `pr-123`
- **SHA-based**: `main-YYYYMMDD-HHmmss` (with timestamp)
- **Latest**: `latest` (default branch only)
- **Semantic**: `v1.0.0` (on version tags)

## Quality Gates

### Security Scanning

- **Vulnerability Detection**: Anchore scanning for high/critical CVEs
- **Build Failure**: Pipeline fails on high-severity vulnerabilities
- **Supply Chain**: SBOM (Software Bill of Materials) generation

### Performance Budgets

- **Build Time**: Optimized with aggressive caching
- **Image Size**: Multi-stage builds minimize production image size
- **Memory Usage**: JVM tuned for container environments

### Observability

- **Build Summaries**: Detailed job status and artifact information
- **Test Results**: Uploaded as pipeline artifacts (30-day retention)
- **Traceability**: Full commit SHA tracking in image tags

## Usage

### Triggering the Pipeline

**Automatic Triggers:**

```yaml
# On pull requests
pull_request:
  branches: [ main, develop ]

# On pushes to main
push:
  branches: [ main ]

# On version tags
push:
  tags: [ 'v*' ]
```

**Manual Trigger:**

```bash
# Via GitHub UI: Actions → Build, Test & Publish → Run workflow
# Via GitHub CLI:
gh workflow run build.yml
```

### Consuming Artifacts

**Docker Images:**

```bash
# Backend service
docker pull ghcr.io/your-org/energy-market-visualization/energy-service:latest

# Frontend application
docker pull ghcr.io/your-org/energy-market-visualization/energy-viz:latest
```

**Development Workflow:**

1. Create feature branch: `feature/issue-123-description`
2. Push commits → Pipeline validates changes
3. Create PR → All matrix jobs run in parallel
4. Merge → Docker images published with `latest` tag

## Performance Characteristics

### Caching Strategy

**Maven Dependencies:**

- Cache key: `pom.xml` file hashes
- Location: `~/.m2/repository` + `backend/target`
- Fallback: OS-based partial cache

**pnpm Dependencies:**

- Cache key: `pnpm-lock.yaml` hash
- Location: `~/.pnpm-store` + `frontend/node_modules`
- Fallback: OS-based partial cache

**Docker Layers:**

- Build cache: GitHub Actions cache
- Registry cache: Layer reuse across builds
- Multi-stage optimization: Separate build and runtime layers

### Expected Performance

| Metric | Cold Build | Warm Build (Cache Hit) |
|--------|------------|----------------------|
| Backend Test | ~5-8 minutes | ~2-3 minutes |
| Frontend Test | ~3-5 minutes | ~1-2 minutes |
| Docker Publish | ~8-12 minutes | ~4-6 minutes |
| **Total Pipeline** | **~15-20 minutes** | **~6-10 minutes** |

## Monitoring & Troubleshooting

### Common Issues

**Cache Misses:**

- Verify `pom.xml` or `pnpm-lock.yaml` hasn't changed
- Check cache key generation in workflow logs

**Docker Build Failures:**

- Ensure Docker context includes required files
- Verify Dockerfile syntax and base image availability

**Test Failures:**

- Check uploaded test artifacts for detailed reports
- Review application logs in workflow output

### Metrics & Observability

**Success Rate:** Pipeline includes health checks and validation  
**Artifact Quality:** Security scanning prevents vulnerable images  
**Traceability:** Full SHA tracking from commit to deployment

## Constitutional Compliance

This pipeline embodies the system constitution principles:

- **Excellence**: Sub-second response time goals, quality gates
- **Simplicity**: Boring technology, proven GitHub Actions
- **Organization**: Monorepo structure, conventional naming
- **Future-Forward**: Modern tooling (JDK 22, React 19)
- **Quality**: 100% coverage requirements, security scanning

## Maintenance

### Updates Required

**Quarterly:**

- Review and update action versions (`@v4` → `@v5`)
- Update base Docker images for security patches
- Review dependency cache strategies

**Monthly:**

- Monitor build performance and optimize if needed
- Review security scan reports and update thresholds

**On Technology Updates:**

- Update JDK version (currently 22)
- Update Node.js version (currently 20)
- Update pnpm version as needed

---

> *"The best build pipeline is one that developers never think about – it just works."*

This pipeline aims to be invisible to developers while maintaining Apple-level quality standards.
