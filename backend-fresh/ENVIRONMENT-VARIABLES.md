# Environment Variables Configuration

## Required Environment Variables

Add these to your `.env` file in the root of the backend directory.

### Application Settings
```env
NODE_ENV=development
PORT=3001
```

### Debug & Logging (NEW - for configurable debug logging)
```env
# Enable debug logging (set to true for detailed logs, false in production)
DEBUG_ENABLED=true

# Log level: debug, info, warn, error
LOG_LEVEL=debug
```

### Database
```env
DATABASE_URL="postgresql://blicktrack_admin:BlickTrack@2024!@localhost:5432/blicktrack_dev?schema=public"
```

### JWT Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Password Hashing
```env
BCRYPT_ROUNDS=12
```

### Email Configuration (Strato SMTP)
```env
SMTP_HOST=smtp.strato.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@blicktrack.com
SMTP_PASSWORD=S@Berlin99
SMTP_FROM_EMAIL=noreply@blicktrack.com
SMTP_FROM_NAME=Blick Track Security
```

### Security Settings
```env
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30
PASSWORD_RESET_TOKEN_EXPIRATION=60
EMAIL_VERIFICATION_TOKEN_EXPIRATION=24
SESSION_TIMEOUT=480
MAX_SESSIONS_PER_USER=5
```

### Rate Limiting
```env
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

## Quick Start

Create a `.env` file in the backend directory with minimum required variables:

```env
# Application
NODE_ENV=development
PORT=3001

# Debug Logging
DEBUG_ENABLED=true
LOG_LEVEL=debug

# Database
DATABASE_URL="postgresql://blicktrack_admin:BlickTrack@2024!@localhost:5432/blicktrack_dev?schema=public"

# JWT
JWT_SECRET=change-this-to-a-secure-random-string-min-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=12
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30

# Email (REQUIRED for verification and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@blicktrack.com
SMTP_FROM_NAME=BlickTrack Security Platform
FRONTEND_URL=http://localhost:3000
EMAIL_VERIFICATION_TOKEN_EXPIRATION=24
PASSWORD_RESET_TOKEN_EXPIRATION=60
```

