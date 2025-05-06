# List available commands
default:
    @just --list

# Initialize development database
init-db:
    mkdir -p sqlite_data
    sqlite3 sqlite_data/events.db < ./scripts/schema.sql
    sqlite3 sqlite_data/events.db < ./scripts/seed.sql
    @echo "Development database initialized!"

# Start development database in Docker
init-db-docker:
    docker compose -f docker-compose.dev.yml up
    @echo "SQLite database container is running"

# Start backend server in development mode
backend-dev:
    cd backend && cargo run

# Start frontend in development mode
frontend-dev:
    cd frontend && npm run dev

# Build frontend for production
frontend-build:
    cd frontend && npm run build

# Build backend for production
backend-build:
    cd backend && cargo build --release

# Build production Docker image
build-prod:
    docker compose build

# Run production setup locally
run-prod:
    docker compose up -d
    @echo "Production environment is running at http://localhost"

# Stop production setup
stop-prod:
    docker compose down

# Deploy to fly.io
deploy:
    fly deploy

# Run frontend and backend in development mode
dev: init-db
    @echo "Starting development environment..."
    @echo "Note: Run backend and frontend in separate terminals with:"
    @echo "just backend-dev"
    @echo "just frontend-dev" 
