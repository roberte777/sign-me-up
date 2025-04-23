#!/bin/bash
set -e

# Check if the database exists
if [ ! -f /data/events.db ]; then
    echo "Initializing database..."
    sqlite3 /data/events.db < /app/schema.sql
    # Set proper permissions
    chown -R www-data:www-data /data
fi

# Test nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Start the backend application as www-data in the background
echo "Starting backend application..."
cd /app/backend
su -s /bin/bash www-data -c "./backend" &
BACKEND_PID=$!

# Start nginx in the foreground with proper Docker configuration
echo "Starting Nginx in foreground..."
exec nginx -g "daemon off;"

# Note: The exec command replaces the current process with nginx
# We won't reach this point unless nginx exits
kill $BACKEND_PID
