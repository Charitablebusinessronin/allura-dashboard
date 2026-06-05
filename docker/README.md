# Allura Dashboard — Docker Deployment

## Quick Start

```bash
# 1. Build and run
docker compose up --build

# 2. Open http://localhost:3000
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DASHBOARD_PORT` | `3000` | Host port to expose |
| `VITE_API_BASE_URL` | `http://localhost:13400` | Allura API backend URL |

## Production Deployment

```bash
# Create external network (shared with Allura backend)
docker network create allura

# Start with env file
cp .env.example .env
# Edit .env with your API URL
docker compose up -d
```

## Multi-stage Build

The Dockerfile uses a 2-stage build:
1. **Builder** (`oven/bun:1.2-slim`) — installs deps and builds the Vite app
2. **Production** (`nginx:alpine-slim`) — serves static files with nginx

Final image size: ~25 MB (nginx alpine + compressed static assets).

## Health Checks

- Container: `wget` probe on `/` every 30s
- Nginx: `/health` endpoint returns `200 healthy`

## SPA Routing

Nginx is configured with `try_files $uri $uri/ /index.html` so React Router deep links work correctly (e.g., `/governance`, `/kanban`).
