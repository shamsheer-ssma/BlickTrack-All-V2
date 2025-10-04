import './globals.css'
import './test.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlickTrack - Enterprise Cybersecurity Management',
  description: 'Comprehensive cybersecurity management platform for enterprises',
  keywords: [
    'cybersecurity',
    'threat modeling',
    'vulnerability management',
    'incident response',
    'compliance',
    'enterprise security'
  ],
  authors: [{ name: 'BlickTrack Team', url: 'https://blicktrack.com' }],
  creator: 'BlickTrack',
  publisher: 'BlickTrack',
  robots: 'index, follow',
  metadataBase: new URL('https://app.blicktrack.com'),
  openGraph: {
    title: 'BlickTrack - Enterprise Cybersecurity Management',
    description: 'Comprehensive cybersecurity management platform for enterprises',
    url: 'https://app.blicktrack.com',
    siteName: 'BlickTrack',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlickTrack Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlickTrack - Enterprise Cybersecurity Management',
    description: 'Comprehensive cybersecurity management platform for enterprises',
    images: ['/twitter-image.png'],
    creator: '@blicktrack',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}