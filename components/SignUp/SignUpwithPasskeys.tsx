'use client'

import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Paper, Stack, Typography, Button } from '@mui/material'
import Link from 'next/link'
import styles from './SignUp.module.css'

type Props = {
  handleCreatePasskey: () => Promise<void>
  isCreating: boolean
}

export default function SignUpWithPasskeys({ handleCreatePasskey, isCreating }: Props) {
  return (
    <Paper className={styles.container}>
      <Stack padding={4} spacing={3}>
        <Typography 
          className={styles.title}
          variant="h1" 
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
          className={styles.loginText}
          variant="body2" 
        >
          Already have an account?{' '}
          <Link href="/" className={styles.loginLink}>
            Login
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}