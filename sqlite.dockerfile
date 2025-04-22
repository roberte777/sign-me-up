FROM alpine:3.18
# Install SQLite
RUN apk add --no-cache sqlite
# Set working directory
WORKDIR /app
# Copy initialization files
COPY ./scripts/init_db.sh /app
COPY ./scripts/schema.sql /app
# Make initialization script executable
RUN chmod +x /app/init_db.sh
# Create volume for data
VOLUME /data
# Run the initialization script
ENTRYPOINT ["/app/init_db.sh"]
