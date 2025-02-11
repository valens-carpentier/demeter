'use client'

import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Paper, Stack, Typography, Button, Link } from '@mui/material'
import theme from '@/styles/global/theme'

type Props = {
  handleCreatePasskey: () => Promise<void>
  isCreating: boolean
}

export default function SignUpWithPasskeys({ handleCreatePasskey, isCreating }: Props) {
  return (
    <Paper sx={{
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: 500,
      margin: '32px auto 0',
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px'
    }}>
      <Stack padding={4} spacing={3}>
        <Typography 
          variant="h1" 
          sx={{
            textAlign: 'center',
            color: theme.palette.text.primary,
            fontWeight: 700,
            letterSpacing: '-0.025em'
          }}
        >
          Create your account
        </Typography>

        <Button
          onClick={handleCreatePasskey}
          startIcon={<FingerprintIcon />}
          variant="contained"
          fullWidth
          disabled={isCreating}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '6px',
            padding: '12px 24px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark'
            },
            '&:disabled': {
              opacity: 0.7
            }
          }}
        >
          {isCreating ? 'Creating...' : 'Create a new passkey'}
        </Button>

        <Typography 
          variant="body2" 
          sx={{
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}
        >
          Already have an account?{' '}
          <Link 
            href="/" 
            sx={{ 
              color: 'primary.main',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}