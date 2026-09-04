# Toolchain baseline for the Energy Market Intelligence stack.
# Backend: Java 22 + Maven 3.9 (from the base image, matching backend/Dockerfile).
# Frontend: Node 26 + pnpm (activated via corepack).
FROM maven:3.9-eclipse-temurin-22

ARG NODE_VERSION=26.8.1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl xz-utils; \
    rm -rf /var/lib/apt/lists/*; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
      amd64) node_arch="x64" ;; \
      arm64) node_arch="arm64" ;; \
      *) echo "unsupported arch: $arch" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" \
      | tar -xJ -C /usr/local --strip-components=1 --no-same-owner; \
    corepack enable; \
    node -v; mvn -v | head -1

# Non-root user that owns the dependency caches written during install.
RUN useradd -m -s /bin/bash ubuntu
USER ubuntu
