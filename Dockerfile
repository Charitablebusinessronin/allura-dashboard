# syntax=docker/dockerfile:1

# ─── Stage 1: Build ──────────────────────────────────────────────
FROM oven/bun:1.2-slim AS builder

WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# ─── Stage 2: Production ───────────────────────────────────────
FROM nginx:alpine-slim AS production

# Install security updates
RUN apk upgrade --no-cache

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

LABEL org.opencontainers.image.title="Allura Dashboard" \
      org.opencontainers.image.description="Allura Memory Dashboard — React + Vite SPA" \
      org.opencontainers.image.source="https://github.com/Charitablebusinessronin/allura-dashboard"

CMD ["nginx", "-g", "daemon off;"]
