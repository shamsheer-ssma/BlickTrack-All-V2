/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Next.js development overlay and indicators
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Remove API rewrites since we're using direct API routes
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3001/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;