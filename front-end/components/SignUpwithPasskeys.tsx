'use client'

import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Paper, Stack, Typography, Button } from '@mui/material'
import Link from 'next/link'


type Props = {
  handleCreatePasskey: () => Promise<void>
  isCreating: boolean
}

export default function SignUpWithPasskeys({ handleCreatePasskey, isCreating }: Props) {
  return (
    <Paper 
      sx={{ 
        margin: '32px auto 0',
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px'
      }}
    >
      <Stack padding={4} spacing={3}>
        <Typography 
          textAlign={'center'} 
          variant="h1" 
          color={'primary'}
        >
          Create your account
        </Typography>

        <Button
          onClick={handleCreatePasskey}
          startIcon={<FingerprintIcon />}
          variant="contained"
          fullWidth
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create a new passkey'}
        </Button>

        <Typography 
          textAlign={'center'} 
          variant="body2" 
          color="GrayText"
        >
          Already have an account?{' '}
          <Link href="/" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Login
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}