#!/usr/bin/env bash
sqlite3 sqlite_data/events.db < ./scripts/schema.sql
sqlite3 sqlite_data/events.db < ./scripts/seed.sql
