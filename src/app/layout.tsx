import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Assistant Virtuel Hakach',
  description: 'Assistant virtuel propulsé par Gemini pour Hakach Transfert',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  )
}
