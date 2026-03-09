# syntax=docker/dockerfile:1

# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM cgr.dev/chainguard/node:latest-dev AS deps

USER root
RUN mkdir -p /app && chown 65532:65532 /app
USER 65532
WORKDIR /app

COPY --chown=65532:65532 package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM cgr.dev/chainguard/node:latest-dev AS builder

USER root
RUN mkdir -p /app && chown 65532:65532 /app
USER 65532
WORKDIR /app

COPY --chown=65532:65532 --from=deps /app/node_modules ./node_modules
COPY --chown=65532:65532 . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM node:25-alpine AS runner

RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --chown=app:app --from=builder /app/.next/standalone ./
COPY --chown=app:app --from=builder /app/.next/static ./.next/static
COPY --chown=app:app --from=builder /app/public ./public

USER app

EXPOSE 3000

CMD ["node", "server.js"]
