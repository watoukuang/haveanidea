# Multi-stage Dockerfile for Next.js (standalone output)

# 1) Build stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production
RUN npm run build

# 2) Runtime stage (minimal)
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose default Next.js port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]


