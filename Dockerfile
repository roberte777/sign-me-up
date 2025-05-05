# Stage 1: Backend builder with improved caching
FROM rust:1.86-slim as backend-builder
WORKDIR /app/backend

# Install build dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy only files needed for dependency resolution
COPY backend/Cargo.toml backend/Cargo.lock ./

# Create dummy src structure that matches real structure
# This helps with better caching of dependencies
RUN mkdir -p src && \
    echo "fn main() {println!(\"dummy\");}" > src/main.rs && \
    # Create a dummy lib.rs file too, in case the project has a lib
    mkdir -p src/lib && \
    echo "pub fn dummy() {}" > src/lib.rs && \
    # Build the dependencies only
    cargo build --release && \
    # Clean up the dummy files
    rm -rf src

# Copy the actual source code
COPY backend/src ./src
# Rebuild with actual source - force rebuild by touching the main file
RUN touch src/main.rs && cargo clean --release -p backend && cargo build --release
# Rebuild with actual source but leveraging cached dependencies
RUN cargo build --release

# Stage 2: Frontend builder with Bun
FROM oven/bun:1.0 as frontend-builder
WORKDIR /app/frontend

# Copy dependency files first for better caching
COPY frontend/package.json frontend/bun.lock ./

# Install dependencies with Bun
RUN bun install

# Copy frontend source and build assets
COPY frontend/ ./
RUN bun run build

# Stage 3: Runtime environment
FROM debian:bookworm-slim AS runtime

# Update and install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    nginx \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Set up directories with proper permissions
WORKDIR /app
RUN mkdir -p /data /app/frontend /app/backend /app/logs && \
    chown -R www-data:www-data /data /app/logs

# Copy built artifacts
COPY --from=backend-builder /app/backend/target/release/backend /app/backend/
COPY --from=frontend-builder /app/frontend/dist /app/frontend/

# Copy configuration files
COPY ./nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default && \
    rm -f /etc/nginx/sites-enabled/default.conf
COPY ./scripts/schema.sql /app/

# Set environment variables
ENV DATABASE_URL=sqlite:/data/events.db
ENV SERVER_HOST=127.0.0.1
ENV SERVER_PORT=3000
ENV RUST_LOG=info

# Create healthcheck script
COPY ./scripts/start.sh /app/
RUN chmod +x /app/start.sh

EXPOSE 80

# Start services
CMD ["/app/start.sh"]
