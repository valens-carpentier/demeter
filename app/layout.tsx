import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/global/theme'

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
