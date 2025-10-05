#!/bin/bash
# BlickTrack Database Initialization Script
#
# This script initializes the BlickTrack database with required PostgreSQL extensions,
# schemas, and permissions. It sets up the database environment for the BlickTrack
# Enterprise cybersecurity platform with multi-tenant architecture.
#
# Purpose:
#   - Initialize PostgreSQL database for BlickTrack
#   - Create required extensions (uuid-ossp, pgcrypto, btree_gin, pg_trgm)
#   - Set up additional schemas (audit, reporting)
#   - Configure permissions for database users
#   - Prepare database for Prisma migrations
#
# Usage: This script runs automatically when the PostgreSQL container starts
# Prerequisites: PostgreSQL container with BlickTrack database
#
# Dependencies:
#   - PostgreSQL 16+
#   - BlickTrack database schema
#   - Prisma migrations
#
# Notes:
#   - Implements comprehensive database initialization
#   - Sets up enterprise-grade database environment
#   - Includes performance optimization extensions
#   - Configures multi-tenant database structure

set -e

# Initialize BlickTrack Database
echo "🚀 Initializing BlickTrack Database..."

# Create extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable required PostgreSQL extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE EXTENSION IF NOT EXISTS "btree_gin";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Create additional schemas if needed
    CREATE SCHEMA IF NOT EXISTS audit;
    CREATE SCHEMA IF NOT EXISTS reporting;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON DATABASE blicktrack_dev TO blicktrack_admin;
    GRANT USAGE ON SCHEMA public TO blicktrack_admin;
    GRANT USAGE ON SCHEMA audit TO blicktrack_admin;
    GRANT USAGE ON SCHEMA reporting TO blicktrack_admin;
    
    -- Create performance indexes
    -- These will be created by Prisma migrations, but we can add custom ones here
    
    -- Log the initialization
    INSERT INTO pg_stat_statements_reset() VALUES (DEFAULT) ON CONFLICT DO NOTHING;
    
    -- Success message
    SELECT 'BlickTrack Database initialized successfully!' AS status;
EOSQL

echo "✅ BlickTrack Database initialization completed!"