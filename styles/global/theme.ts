'use client'

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      dark: '#2E7D32',
      light: '#81C784',
    },
    secondary: {
      main: '#2775CA',
      dark: '#1E5C9E',
      light: '#5C9EE1',
    },
    text: {
      primary: '#2C3E2D',
      secondary: '#5C745D',
    },
    background: {
      default: '#F5F2EA',
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#D32F2F',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontWeight: 400,
    },
    overline: {
      fontWeight: 500,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
          },
        },
      },
    },
  },
});

export default theme;