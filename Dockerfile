# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY db/ ./db/

RUN npm run build

# Stage 2: Production
FROM node:22-slim AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY locales/ ./locales/

RUN mkdir -p logs

ENV NODE_ENV=production
