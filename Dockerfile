# Build stage
FROM node:20-slim AS builder

WORKDIR /build
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:20-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g pnpm && \
    adduser --disabled-password --gecos "" botuser

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /build/dist ./dist

USER botuser

VOLUME ["/app/data"]
CMD ["pnpm", "start"]