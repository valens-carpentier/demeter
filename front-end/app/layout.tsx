import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import '@/styles/globals.css'
import styles from '@/styles/layout.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Demeter',
  description: 'A decentralized platform for fractional farm ownership using tokenization'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.mainContainer}>
          {children}
        </div>
      </body>
    </html>
  )
}
