import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Demeter',
  description: 'A decentralized platform for fractional farm ownership using tokenization'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem'
          }}
        >
        </nav>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: '40px',
            marginRight: '40px',
            flexDirection: 'column'
          }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
