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
      main: '#2C3E2D',
      dark: '#1B2A1E',
      light: '#5C745D',
    },
    text: {
      primary: '#2C3E2D',
      secondary: '#5C745D',
      disabled: '#A8B5A9',
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
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: 'SF Pro Text, sans-serif',
    
    allVariants: {
      color: '#2C3E2D',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.025em',
      color: '#2C3E2D',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
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
      fontSize: '0.75rem',
    },
    overline: {
      fontSize: '0.625rem',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '6px',
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#2E7D32',
          },
        },
        outlined: {
          color: '#4CAF50',
          border: '2px solid #4CAF50',
          fontWeight: 600,
          textTransform: 'none',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: '#4CAF50',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
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
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            padding: '16px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#4CAF50',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          margin: '4px 0',
          '&:hover': {
            backgroundColor: '#F5F2EA',
            color: '#2C3E2D',
          },
          '&.active': {
            backgroundColor: '#F5F2EA',
            color: '#2C3E2D',
            fontWeight: 600,
            '& .MuiListItemIcon-root': {
              color: '#4CAF50',
            },
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      standard: 300,
    },
  },
});

export default theme;