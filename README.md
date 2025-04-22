# Sign Me Up

A web application for zero hassle event management and group sign-ups. This
application allows users to create events, form groups, and manage sign-ups 
easily.

## Project Overview

Sign Me Up is built with:

- **Backend**: Rust with Axum web framework
- **Frontend**: Modern JavaScript/TypeScript with React
- **Database**: SQLite (both for development and production)
- **Deployment**: Docker-based, deployable to Fly.io or any Docker-compatible platform

## Development Environment Setup

### Prerequisites

To develop this project, you'll need:

- **Rust** 1.86+ (https://rustup.rs/)
- **Node.js** 20+ (https://nodejs.org/)
- **Just** command runner (https://github.com/casey/just)

You need one of these, depending on how you want to set up the database.

- **SQLite3** CLI
- **Docker** (optional for development, required for production)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd sign-me-up
   ```

2. Create a `.env` file by copying the example:

   ```bash
   cp .env.example .env
   ```

3. Initialize the development database using docker:

   ```bash
   just init-db
   ```

   Alternatively, you can do this yourself if you installed sqlite:

   ```bash
   just init-db
   ```

### Running Development Environment

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 - Backend server
just backend-dev

# Terminal 2 - Frontend dev server
just frontend-dev
```

The application will be available at:

- Backend API: http://localhost:3000
- Frontend development server: http://localhost:5173

## Production Environment with Docker

### Local Production Setup

The production setup bundles the frontend, backend, and SQLite database in a
single Docker container, exposed via Nginx.

1. Build the production Docker image:

   ```bash
   docker compose build
   ```

2. Start the production container:

   ```bash
   docker compose up
   ```

3. To stop the production container:
   ```bash
   docker compose down
   ```

The application will be available at http://localhost.

### Production Architecture

The production Docker setup consists of:

1. **Multi-stage build process**:

   - Stage 1: Builds the Rust backend with dependency caching
   - Stage 2: Builds the frontend using Bun
   - Stage 3: Creates a slim runtime with only the necessary components

2. **Components**:

   - Nginx web server that serves static frontend assets and proxies API requests
   - Rust backend server running on port 3000 internally
   - SQLite database stored in a Docker volume

3. **Data Persistence**:
   - SQLite database files are stored in a Docker volume for persistence

### Deploying to Fly.io

This project is configured for easy deployment to Fly.io:

1. Install the Fly CLI:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login to Fly:

   ```bash
   fly auth login
   ```

3. Deploy the application:
   ```bash
   just deploy
   ```
