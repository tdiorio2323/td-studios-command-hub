import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TD Studios | Command Hub',
  description: 'AI-powered portal for modern digital experiences',
  keywords: ['AI', 'Dashboard', 'Portal', 'Development', 'TD Studios'],
  authors: [{ name: 'Tyler DiOrio', url: 'https://tdstudios.com' }],
  creator: 'Tyler DiOrio',
  publisher: 'TD Studios',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tdstudios.com',
    title: 'TD Studios | Command Hub',
    description: 'AI-powered portal for modern digital experiences',
    siteName: 'TD Studios',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TD Studios | Command Hub',
    description: 'AI-powered portal for modern digital experiences',
    creator: '@tdstudios',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <div className="matrix-bg" />
        {children}
      </body>
    </html>
  )
}
