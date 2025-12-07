# frontend/Dockerfile
FROM docker.io/oven/bun:1-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json bun.lock ./

# Install all dependencies including devDependencies for build
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_KOMIIX_BACKEND_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_KOMIIX_BACKEND_URL=$VITE_KOMIIX_BACKEND_URL

# Optimize build for large files
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV VITE_BUILD_CHUNKS="true"

# Build with optimizations
RUN bun run build

# Compress static files
RUN find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.wasm" \) -exec gzip -k {} \;

# Production stage optimized for WASM
FROM docker.io/library/nginx:alpine

# Install required packages
RUN apk add --no-cache curl brotli

# Copy our optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create directory for workers
RUN mkdir -p /usr/share/nginx/html/workers

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
