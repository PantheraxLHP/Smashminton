# Use Node.js LTS Alpine as the base image for maximum efficiency
FROM node:18-alpine AS base
RUN apk add --no-cache tini
WORKDIR /app

# Dependencies stage - install only what's needed
FROM base AS deps
# Install minimal system dependencies for native modules
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    libc6-compat \
    && ln -sf python3 /usr/bin/python

# Copy package files for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with optimizations
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force && \
    apk del .build-deps

# Install dev dependencies separately for build
FROM base AS build-deps
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && \
    npm cache clean --force && \
    npx prisma generate && \
    apk del .build-deps

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies and source
COPY --from=build-deps /app/node_modules ./node_modules
COPY --from=build-deps /app/prisma ./prisma
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build && \
    # Remove source files and dev dependencies
    rm -rf src test *.ts *.json nest-cli.json .prettier* tsconfig* && \
    # Keep only essential files
    find . -name "*.map" -delete && \
    find . -name "*.d.ts" -delete

# Minimal production image using distroless
FROM gcr.io/distroless/nodejs18-debian12:nonroot AS runner

# Copy built application and production dependencies
COPY --from=deps --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/prisma ./prisma
COPY --from=builder --chown=nonroot:nonroot /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Use nonroot user (already set in distroless)
USER nonroot

# Start the application
CMD ["dist/src/main.js"] 