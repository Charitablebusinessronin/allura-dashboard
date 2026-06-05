FROM oven/bun:1.2-slim AS builder
WORKDIR /app

# Copy only what's needed for the mock API
COPY mock-api/server.ts ./mock-api/server.ts
COPY package.json bun.lock ./

# Install dependencies (minimal)
RUN bun install --production --ignore-scripts

# ─── Production image ──────────────────────────────────────────
FROM oven/bun:1.2-slim
WORKDIR /app

# Copy server and deps
COPY --from=builder /app/mock-api/server.ts ./mock-api/server.ts
COPY --from=builder /app/node_modules ./node_modules

ENV MOCK_API_PORT=13400
ENV NODE_ENV=production

EXPOSE 13400

CMD ["bun", "run", "mock-api/server.ts"]
