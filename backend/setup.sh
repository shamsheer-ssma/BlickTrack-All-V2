#!/usr/bin/env bash
# BlickTrack Enterprise Setup Script
#
# This script sets up the BlickTrack Enterprise Backend for development.
# It handles database connection, Prisma client generation, migrations,
# seeding, and application building.
#
# Usage: ./setup.sh
#
# Prerequisites:
# - PostgreSQL database running
# - Node.js and npm installed
# - Prisma CLI available

echo "🚀 Setting up BlickTrack Enterprise Backend..."

# Check if PostgreSQL is running
echo "📊 Checking database connection..."
if npx prisma db pull 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database not running. Please start PostgreSQL first."
    echo "   For Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create database migration
echo "📝 Creating initial migration..."
npx prisma migrate dev --name "enterprise-schema-initial"

# Seed database with initial data
echo "🌱 Seeding database..."
if [ -f "prisma/seed.ts" ]; then
    npx tsx prisma/seed.ts
else
    echo "⚠️  No seed file found, skipping..."
fi

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Setup complete! Your BlickTrack Enterprise backend is ready."
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run start:dev"
echo "2. Visit http://localhost:3000/api for API documentation"
echo "3. Use Prisma Studio: npx prisma studio"