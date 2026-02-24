import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'

import { ClientProviders } from '@/components/ClientProviders'

import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Private Delegate Statements',
  description:
    'Allows DAO delegates to make private statements without revealing their identity.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
