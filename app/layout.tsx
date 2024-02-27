import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import '../styles/prism.css'
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeProvider'

export const metadata: Metadata = {
  title: 'DevOverflow',
  description: 'A community-driven platform for assking and answering programming questions.' +
    'Get help, share knowledge, and collaborate with developers from around the world. Explore topics in' +
    'web development, algorithms, data structures, and more.',
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}
      >
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 'primary-gradient',
              footerActionLink:
                'primary-text-gradient hover:text-primary-500'
            }
          }}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}