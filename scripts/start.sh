#!/bin/bash
set -e

# 1. Ensure directory ownership & perms
echo "Configuring /data permissions..."
chown -R www-data:www-data /data           # ensure any existing files are owned
chmod 755 /data                             # directory readable/executable

# 2. Initialize DB if needed
if [ ! -f /data/events.db ]; then
    echo "Initializing database..."
    sqlite3 /data/events.db < /app/schema.sql
fi

# 3. Fix ownership & perms on the newly-created DB
echo "Fixing database file ownership..."
chown www-data:www-data /data/events.db     # reassign DB file
chmod 664 /data/events.db                   # owner & group writable

# 4. Continue with nginx & backend startup...
echo "Testing Nginx configuration..."
nginx -t

echo "Starting backend application..."
cd /app/backend
su -s /bin/bash www-data -c "./backend" &

echo "Starting Nginx..."
exec nginx -g "daemon off;"
