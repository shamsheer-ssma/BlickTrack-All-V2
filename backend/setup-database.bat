@echo off
echo ================================================
echo 🚀 BlickTrack Database Setup for Windows
echo ================================================

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not running!
    echo Please install Docker Desktop for Windows and ensure it's running.
    pause
    exit /b 1
)

echo ✅ Docker is available

REM Stop any existing containers
echo 🛑 Stopping existing BlickTrack containers...
docker-compose down

REM Remove existing volumes (optional - comment out to preserve data)
echo 🗑️ Removing existing volumes for fresh start...
docker volume rm blicktrack_postgres_data blicktrack_redis_data blicktrack_pgadmin_data 2>nul

REM Start the database services
echo 🚀 Starting BlickTrack database services...
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
:wait_loop
timeout /t 5 /nobreak >nul
docker exec blicktrack-postgres pg_isready -U blicktrack_admin -d blicktrack_dev >nul 2>&1
if %errorlevel% neq 0 (
    echo   Still waiting for database...
    goto wait_loop
)

echo ✅ Database is ready!

REM Run Prisma migrations
echo 📋 Running Prisma migrations...
npx prisma migrate dev --name "initial-setup"

REM Seed the database
echo 🌱 Seeding database with initial data...
npx prisma db seed

REM Show status
echo ================================================
echo ✅ BlickTrack Database Setup Complete!
echo ================================================
echo 📊 Services Available:
echo   • PostgreSQL Database: localhost:5432
echo   • pgAdmin Web Interface: http://localhost:8080
echo   • Redis Cache: localhost:6379
echo.
echo 🔐 Database Credentials:
echo   • Database: blicktrack_dev
echo   • Username: blicktrack_admin
echo   • Password: BlickTrack@2024!
echo.
echo 🌐 pgAdmin Credentials:
echo   • Email: admin@blicktrack.com
echo   • Password: BlickTrack@Admin2024!
echo.
echo 📝 Next Steps:
echo   1. Open pgAdmin at http://localhost:8080
echo   2. Run: npm run dev (to start the backend)
echo   3. Run: npx prisma studio (to view database)
echo.
echo ================================================

pause