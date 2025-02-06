import { ThemeProvider } from '@mui/material/styles'
import { Inter } from 'next/font/google'
import theme from '@/styles/global/theme'
import '@/styles/global/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
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
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
