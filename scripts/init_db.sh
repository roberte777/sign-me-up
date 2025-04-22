#!/bin/sh
set -e

# Create data directory if it doesn't exist
mkdir -p /data

# Create database if it doesn't exist
sqlite3 /data/events.db < /app/schema.sql

echo "Database initialized successfully!"

# Keep container running if needed
if [ "$1" = "keep-alive" ]; then
    tail -f /dev/null
fi
