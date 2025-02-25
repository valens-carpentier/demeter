import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/global/theme'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demeter',
  description: 'A decentralized platform for fractional farm ownership using tokenization',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
