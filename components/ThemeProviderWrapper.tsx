'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/global/theme'

export default function ThemeProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
} 