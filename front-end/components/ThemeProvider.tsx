import { ThemeProvider, type Theme } from '@mui/material'
import type { Shadows } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { type FC } from 'react'

type SafeThemeProviderProps = {
  children: (safeTheme: Theme) => JSX.Element
}

const SafeThemeProvider: FC<SafeThemeProviderProps> = ({ children }) => {
  const theme = createSafeTheme()
  return <ThemeProvider theme={theme}>{children(theme)}</ThemeProvider>
}

export default SafeThemeProvider

const createSafeTheme = (): Theme => {
  const shadowColor = colors.primary.main

  return createTheme({
    palette: {
      mode: 'light',
      ...colors,
      background: {
        default: '#F5F2EA', // Beige background
        paper: '#FFFFFF'
      }
    },
    shape: {
      borderRadius: 6
    },
    shadows: [
      'none',
      `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      `0 2px 20px ${shadowColor}0a, 0 8px 32px ${shadowColor}14`,
      `0 8px 32px ${shadowColor}0a, 0 24px 60px ${shadowColor}14`,
      ...Array(20).fill('none')
    ] as Shadows,
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          sizeMedium: {
            fontSize: '16px',
            padding: '12px 24px'
          },
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontWeight: 'bold',
            lineHeight: 1.25,
            borderColor: theme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }),
          outlined: {
            border: '2px solid',
            '&:hover': {
              border: '2px solid'
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF'
          }
        }
      }
    }
  })
}

const typography: TypographyOptions = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  h1: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 600,
    letterSpacing: '-0.025em'
  },
  h4: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 500,
    letterSpacing: '-0.01em'
  }
}

const colors = {
  text: {
    primary: '#2C3E2D', // Dark green for text
    secondary: '#5C745D', // Medium green for secondary text
    disabled: '#A5B5A6' // Light green for disabled text
  },
  primary: {
    dark: '#2E7D32', // Darker green
    main: '#4CAF50', // Main green
    light: '#81C784' // Light green
  }
}
