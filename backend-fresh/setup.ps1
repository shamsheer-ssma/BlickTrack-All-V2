# BlickTrack Enterprise Setup Script (PowerShell)
#
# This script sets up the BlickTrack Enterprise Backend for development.
# It handles database connection, Prisma client generation, migrations,
# seeding, and application building.
#
# Usage: .\setup.ps1
#
# Prerequisites:
# - PostgreSQL database running
# - Node.js and npm installed
# - Prisma CLI available

Write-Host "🚀 Setting up BlickTrack Enterprise Backend..." -ForegroundColor Green

# Check if PostgreSQL is running
Write-Host "📊 Checking database connection..."
try {
    npx prisma db pull 2>$null
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Database not running. Please start PostgreSQL first." -ForegroundColor Red
    Write-Host "   For Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres"
    exit 1
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..."
npx prisma generate

# Create database migration
Write-Host "📝 Creating initial migration..."
npx prisma migrate dev --name "enterprise-schema-initial"

# Seed database with initial data
Write-Host "🌱 Seeding database..."
if (Test-Path "prisma/seed.ts") {
    npx tsx prisma/seed.ts
} else {
    Write-Host "⚠️  No seed file found, skipping..." -ForegroundColor Yellow
}

# Build the application
Write-Host "🏗️  Building application..."
npm run build

Write-Host "✅ Setup complete! Your BlickTrack Enterprise backend is ready." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start the development server: npm run start:dev"
Write-Host "2. Visit http://localhost:3000/api for API documentation"
Write-Host "3. Use Prisma Studio: npx prisma studio"