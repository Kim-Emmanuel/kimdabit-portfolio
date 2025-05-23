import type { Metadata, Viewport } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { A11yProvider } from '@/context/A11yContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: ['400', '500', '600']
})

export const metadata: Metadata = {
  title: 'Kim Dabit | Portfolio of a Software Developer',
  description: 'A cutting-edge developer portfolio showcasing technical mastery and creative innovation',
  metadataBase: new URL('https://kimdabit.vercel.app'),
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: '/icons/favicon.ico',
  },
  keywords: [
    'software developer',
    'web development',
    'full-stack developer',
    'React',
    'Next.js',
    'Three.js',
    'portfolio'
  ],
  authors: [{ name: 'Kim Dabit' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kimdabit.vercel.app',
    title: 'Kim Dabit Portfolio',
    description: 'A cutting-edge developer portfolio showcasing technical mastery and creative innovation',
    siteName: 'Kim Dabit Portfolio',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Kim Dabit Portfolio Preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kim Dabit Portfolio',
    description: 'A cutting-edge developer portfolio showcasing technical mastery and creative innovation',
    images: ['/og-image.jpg'],
    creator: '@kimdabit'
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A192F',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-primary text-white antialiased">
        <A11yProvider>
          <Layout>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </Layout>
        </A11yProvider>
      </body>
    </html>
  );
}
