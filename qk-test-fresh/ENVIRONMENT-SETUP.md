# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root of the `qk-test` directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Feature Flags
NEXT_PUBLIC_SHOW_LANDING_PAGE=true

# Company Configuration (Optional)
NEXT_PUBLIC_COMPANY_NAME=BlickTrack
NEXT_PUBLIC_SUPPORT_EMAIL=support@blicktrack.com

# API Configuration (Optional)
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Setup Instructions

1. Copy the environment variables above
2. Create a new file called `.env.local` in the `qk-test` directory
3. Paste the environment variables into the file
4. Update the values as needed for your environment

## Important Notes

- **Never hardcode URLs or sensitive values in source code**
- Always use environment variables for configuration
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Restart your development server after changing environment variables

## Development vs Production

- **Development**: Use `http://localhost:5000/api/v1` for local backend
- **Production**: Update `NEXT_PUBLIC_API_URL` to your production API URL
- **Staging**: Update `NEXT_PUBLIC_API_URL` to your staging API URL
